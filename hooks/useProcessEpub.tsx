import { useEffect, useState } from "react";
import RNFS from "react-native-fs";
import xml2js from "react-native-xml2js";
import { Dimensions } from "react-native";
import { APP_DOCUMENTS_PATH } from "../services/download.services";
import { getStorageBookData } from "../services/storage.services";

interface ProcessEpubResult {
  htmlFiles: ParsedItem[];
  htmlCurrentFileIndex: number;
  contentPath: string;
  cssPath: string;
  loading: boolean;
}

const orderedItems: ParsedItem[] = [];
let opfPath: string = "";
let contentPath: string = "";

/**
 * Custom hook used to process and load the EPUB file of the ebook
 * whose identifier matches with the id passed by parameter.
 *
 * @param ebookId the identifier of the book to be loaded
 */
export function useProcessEpub(ebookId: string): ProcessEpubResult {
  const [htmlFiles, setHtmlFiles] = useState<ParsedItem[]>([]);
  const [htmlCurrentFileIndex, setHtmlCurrentFileIndex] = useState<number>(0);
  const [contentPath, setContentPath] = useState<string>("");
  const [cssPath, setCssPath] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    processEpub(
      ebookId,
      setHtmlFiles,
      setHtmlCurrentFileIndex,
      setContentPath,
      setCssPath,
      setLoading,
    )
      .then()
      .catch((err) => console.error(err));
  }, []);

  return {
    htmlFiles,
    htmlCurrentFileIndex,
    contentPath,
    cssPath,
    loading,
  };
}

/**
 * Parses the EPUB file, setting the values of the variables that contain the
 * HTML content and css styles in RN format and are returned by useProcessEpub hook.
 *
 * @param ebookId the id of the ebook that is going to be processed. This is needed to search the EPUB's content directory
 * @param setLoading setState function used to set the value of loading state
 * @param setTagStyles setState function used to set the value of tagStyles state
 * @param setClassStyles setState function used to set the value of classStyles state
 * @param setHtmlContent setState function used to set the value of htmlContent state
 */
async function processEpub(
  ebookId: string,
  setHtmlFiles: React.Dispatch<React.SetStateAction<ParsedItem[]>>,
  setHtmlCurrentFileIndex: React.Dispatch<React.SetStateAction<number>>,
  setContentPath: React.Dispatch<React.SetStateAction<string>>,
  setCssPath: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> {
  const unzipPath = `${APP_DOCUMENTS_PATH}/${ebookId}`;
  // Get the opf file path, and set the content path
  opfPath = await getOPFPath(unzipPath);
  contentPath = opfPath.substring(0, opfPath.lastIndexOf("/") + 1);
  setContentPath(contentPath);
  // get the items from the opf files
  await getOpfItems(unzipPath + "/" + opfPath);
  const cssPath = orderedItems.find(
    (item) => item.mediaType === "text/css",
  )?.href;
  if (cssPath) {
    setCssPath(cssPath);
  }
  await loadHtmlFiles(setHtmlFiles);
  if (!getStorageBookData(ebookId)) {
    await addCustomCSS(unzipPath, cssPath!);
  }
  setLoading(false);
}

/**
 * Gets the OPF file's path. In EPUB files, the OPF file is used as index,
 * having ordered references of its contents.
 *
 * @param unzippedPath the path where the EPUB file was unziped
 * @returns a Promise encapsulating a string that contains the OPF file's path
 */
async function getOPFPath(unzippedPath: string): Promise<string> {
  const containerXMLPath = `${unzippedPath}/META-INF/container.xml`;
  let path = "";

  try {
    const containerXML = await RNFS.readFile(containerXMLPath, "utf8");

    const parser = new xml2js.Parser();

    parser.parseString(
      containerXML,
      (err: Error | undefined, parsedData: ContainerParsedData) => {
        if (err) {
          console.error("Error parsing XML:", err);
          return null;
        }

        path = parsedData.container.rootfiles[0].rootfile[0].$["full-path"];
      },
    );
  } catch (error) {
    console.error("Error parsing container.xml:", error);
  }

  return path;
}

/**
 * Parses the OPF file and sets the Styles, Images and HTML paths
 *
 * @param the OPF file's path'
 */
async function getOpfItems(path: string): Promise<void> {
  // Read the OPF file
  const opfXML = await RNFS.readFile(path, "utf8");

  // Create a parser instance
  const parser = new xml2js.Parser();

  // Parse the XML content using a promise
  const parsedData: OPFParsedData = await new Promise((resolve, reject) => {
    parser.parseString(
      opfXML,
      (err: Error | undefined, result: OPFParsedData) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });

  const itemrefs: ItemRef[] = parsedData.package.spine[0].itemref;
  const items: OPFManifestItem[] = parsedData.package.manifest[0].item;
  for (const itemRef of itemrefs) {
    for (const item of items) {
      const { id, href, "media-type": mediaType } = item.$;

      if (id === itemRef.$.idref) {
        const parsedItem: ParsedItem = {
          id,
          href,
          mediaType,
        };
        orderedItems.push(parsedItem);
        break;
      }
    }
  }

  for (const item of items) {
    const { id, href, "media-type": mediaType } = item.$;

    if (mediaType === "text/css") {
      const parsedItem: ParsedItem = {
        id,
        href,
        mediaType,
      };
      orderedItems.push(parsedItem);
    }
  }
}

/**
 * Adds custom styles to EPUB's' existent CSS file
 */
async function addCustomCSS(unzipPath: string, cssPath: string) {
  const dimensions = Dimensions.get("window");
  const css = await RNFS.readFile(
    `${unzipPath}/${contentPath}${cssPath}`,
    "utf8",
  );

  // Add custom styles
  let updatedStyles = getCustomElementStyles(
    css,
    "body",
    `height: ${dimensions.height * 0.9}px; width: ${dimensions.width * 0.95}px; column-width: ${dimensions.width * 0.95}px; column-gap: 0px;column-fill: auto;-webkit-column-width: ${dimensions.width * 2}px;-webkit-column-gap: 0px;overflow-x: hidden;overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none;`,
  );

  updatedStyles = getCustomElementStyles(
    updatedStyles,
    "html",
    `margin: 0;padding: 0;height: ${dimensions.height * 0.9}px;width: ${dimensions.width * 0.95}px;overflow: hidden; touch-action: none;`,
  );

  updatedStyles = getCustomElementStyles(
    updatedStyles,
    "p",
    `line-height: 20px; text-align: justify; letter-spacing: 0.2px; padding: 0;`,
  );

  updatedStyles = getCustomElementStyles(
    updatedStyles,
    "img",
    `max-width: 100%;height: auto;`,
  );

  updatedStyles = getCustomElementStyles(
    updatedStyles,
    ".content-wrapper",
    `padding-left: 10px; padding-right:10px; box-sizing: border-box;`,
  );

  // Add custom fonts
  updatedStyles = getCustomElementStyles(
    updatedStyles,
    "@font-face",
    `font-family: 'Merryweather'; src: url('file:///android_asset/fonts/merriweather_regular.ttf') format('truetype'); font-weight: normal; font-style: normal;`,
  );
  updatedStyles = getCustomElementStyles(
    updatedStyles,
    "@font-face",
    `font-family: 'Merryweather'; src: url('file:///android_asset/fonts/merriweather_bold.ttf') format('truetype'); font-weight: bold; font-style: normal;`,
  );
  updatedStyles = getCustomElementStyles(
    updatedStyles,
    "@font-face",
    `font-family: 'Merryweather'; src: url('file:///android_asset/fonts/merriweather_italic.ttf') format('truetype'); font-weight: normal; font-style: italic;`,
  );

  console.log(updatedStyles);

  // write updated styles into CSS file
  await RNFS.writeFile(
    `${unzipPath}/${contentPath}${cssPath}`,
    updatedStyles,
    "utf8",
  );
}

/**
 * Gets a CSS format style for the tag passed by parameter.
 *
 * @returns the CSS style
 */
function getCustomElementStyles(
  originalCss: string,
  tag: string,
  customStyles: string,
): string {
  const paragraphStyleIndex = originalCss.indexOf(`${tag} {`);
  let updatedCss = "";
  if (paragraphStyleIndex !== -1) {
    const paragraphStylesString = originalCss.substring(
      paragraphStyleIndex,
      originalCss.indexOf("}", paragraphStyleIndex),
    );
    const updatedParagraphStyle = paragraphStylesString + customStyles + "}";
    const selectorPattern = `${tag}\\s*{\\s*([a-zA-Z0-9-]+\\s*:\\s*[^;]+;\\s*)+}`;
    const selectorRegex = new RegExp(selectorPattern, "g");

    updatedCss = originalCss.replace(selectorRegex, updatedParagraphStyle);
  } else {
    updatedCss = `\n\t\t\t\t${tag} {${customStyles}}` + originalCss;
  }

  return updatedCss;
}

/**
 * Selects a random HTML file and loads its content.
 *
 * @param setHtmlFiles the setState used to set the htmlContent value
 * @param unzipFolderPath the path where the the EPUB was unzipped
 */
async function loadHtmlFiles(
  setHtmlFiles: React.Dispatch<React.SetStateAction<ParsedItem[]>>,
): Promise<void> {
  const htmlItems = orderedItems.filter(
    (item) =>
      item.mediaType === "text/html" ||
      item.mediaType === "application/xhtml+xml",
  );
  setHtmlFiles(htmlItems);
}
