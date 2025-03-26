import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useProcessEpub } from "../hooks/useProcessEpub";
import RNFS from "react-native-fs";
import { APP_DOCUMENTS_PATH } from "../services/download.services";
import {
  addStorageBookData,
  getStorageBookData,
} from "../services/storage.services";
import { addUserBookRegistration } from "../services/activityRegistrations.services";
import { emptyDateTime } from "../utils/date.utils";

interface EpubReaderProps {
  ebookId: string;
}

let firstFileIndex = -1;
let MAX_PAGES = 0;
const AVERAGE_WORDS_PER_MINUTE = 200;
const MAX_MINUTES = 20;

const EpubReader: React.FC<EpubReaderProps> = ({ ebookId }) => {
  const unzipPath = `${APP_DOCUMENTS_PATH}/${ebookId}`;
  const { width } = Dimensions.get("screen");
  const { htmlFiles, contentPath, loading, tagStyles, classStyles } =
    useProcessEpub(ebookId);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const scrollViewRef = useRef<ScrollView | null>(null);
  let finishedReading = false;
  // Hook to set up the content that can be read
  useEffect(() => {
    if (htmlFiles.length > 0) {
      const bookData = getStorageBookData(ebookId);

      // if book data has been stored, retrieve it and set the params.
      // if not, then generate the params and save them to local storage.
      if (bookData) {
        setCurrentFileIndex(bookData.firstPageIndex);
        firstFileIndex = bookData.firstPageIndex;
        MAX_PAGES = bookData.maxPages;
      } else {
        const randomIndex = Math.floor(Math.random() * htmlFiles.length);
        firstFileIndex = randomIndex;
        setCurrentFileIndex(randomIndex);

        setMaxPages(randomIndex)
          .then(() => {
            addStorageBookData({
              id: ebookId,
              data: { maxPages: MAX_PAGES, firstPageIndex: firstFileIndex },
            });
          })
          .catch((error) => console.error(error));
      }
    }
  }, [htmlFiles]);

  // Hook to load the HTML content of the current HTML file
  useEffect(() => {
    if (currentFileIndex !== -1) {
      loadHTMLContent(htmlFiles[currentFileIndex]);
      finishedReading = currentFileIndex === firstFileIndex + MAX_PAGES;

      if (finishedReading) {
        const currentDate = new Date();
        emptyDateTime(currentDate);
        addUserBookRegistration({
          internetArchiveId: ebookId,
          registrationDate: currentDate.valueOf(),
          userId: 1,
        });
      }
    }
  }, [currentFileIndex]);

  /**
   * Sets the maximum pages that the user can read.
   * This is calculated knowing that the average reading time is 200 words per minute.
   * The maximum number of pages is calculated parsing the paragraph items from the EPUB's HTML
   * files and extracting the number of words of each.
   *
   * @param firstIndex the random index where the reading starts
   */
  async function setMaxPages(firstIndex: number) {
    const htmlParagraphRegex = /<p>(.*?)<\/p>/g;
    const maxWords = AVERAGE_WORDS_PER_MINUTE * MAX_MINUTES;
    let currentWords = 0;

    for (let i = firstIndex; i < htmlFiles.length; i++) {
      const selectedItem = htmlFiles[i];
      let pageWords = 0;
      let matches;

      const content = await RNFS.readFile(
        `${unzipPath}/${contentPath}${selectedItem.href}`,
        "utf8",
      );

      while ((matches = htmlParagraphRegex.exec(content)) !== null) {
        pageWords += matches[1].split(" ").length;
      }

      currentWords += pageWords;

      if (currentWords < maxWords) {
        MAX_PAGES++;
      } else {
        break;
      }
    }
  }

  /**
   * Loads the HTML content of the item passed by parameter
   *
   * @param selectedItem the item to load the HTML content from
   */
  function loadHTMLContent(selectedItem: ParsedItem) {
    RNFS.readFile(`${unzipPath}/${contentPath}${selectedItem.href}`, "utf8")
      .then((content) => {
        const updatedContent = setImagePaths(content);
        setHtmlContent(updatedContent);
        resetScrollViewPosition();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Sets the html image paths to point to the absolute path of the images.
   *
   * @param html the HTML content as string
   * @param unzipFolderPath the path where the selected book has been unzipped
   */
  function setImagePaths(html: string): string {
    const documentDirPath = `file://${unzipPath}/${contentPath}`;

    // Match any path starting with "../" followed by any folder or file name
    let updatedHtml = html.replace(
      /src="\.\.\/([^"]+)"/g,
      (_, relativePath) => {
        const newPath = `${documentDirPath}/${relativePath}`;
        return `src="${newPath}"`;
      },
    );

    // Handle images at the root (e.g., "src="image.jpg" without any "../")
    updatedHtml = updatedHtml.replace(/src="([^/"]+)"/g, (_, imgName) => {
      const newPath = `${documentDirPath}/${imgName}`;
      return `src="${newPath}"`;
    });

    return updatedHtml;
  }

  /**
   * Makes the ScrollView scroll to the beginning.
   */
  function resetScrollViewPosition() {
    if (scrollViewRef.current != null)
      scrollViewRef?.current.scrollTo({ y: 0, animated: true });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          flex: 1,
          paddingRight: 10,
          paddingLeft: 20,
          paddingVertical: 10,
        }}
        ref={scrollViewRef}
      >
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {!loading && finishedReading && (
          <View>
            <Text>You finished reading for today</Text>
          </View>
        )}
        {!loading && !finishedReading && (
          <RenderHTML
            source={{
              html: htmlContent,
            }}
            contentWidth={width}
            tagsStyles={tagStyles}
            classesStyles={classStyles}
          />
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setCurrentFileIndex(currentFileIndex - 1);
          }}
          disabled={
            finishedReading ||
            currentFileIndex <= firstFileIndex ||
            currentFileIndex == 0
          }
        >
          <Text>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setCurrentFileIndex(currentFileIndex + 1);
          }}
          disabled={
            finishedReading ||
            currentFileIndex >= firstFileIndex + MAX_PAGES ||
            currentFileIndex == htmlFiles.length - 1
          }
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EpubReader;
