import {unzip} from 'react-native-zip-archive'
import RNFS from 'react-native-fs'
import {NativeModules} from 'react-native'
import {getBookMetadata} from './books.services'
// Holds the root path where downloaded files are stored
export const APP_DOCUMENTS_PATH = `${RNFS.ExternalDirectoryPath}/Documents`

/*
 * Downloads and unzips the EPUB file corresponding to the given
 * Internet Archive item identifier.
 * @param ebookId - The item identifier
 */
export async function downloadAndUnzipEpub(ebookId: string) {
  const metadata = await getBookMetadata({id: ebookId})
  const fileName = metadata?.files.find(file => file.format === 'EPUB')?.name
  const epubUrl = `https://archive.org/download/${ebookId}`
  const unzipPath = `${APP_DOCUMENTS_PATH}/${ebookId}`
  const {BackgroundDownloadModule} = NativeModules

  if (epubUrl !== undefined && fileName !== undefined) {
    const bookExists = await RNFS.exists(unzipPath)

    if (!bookExists) {
      // Call to the native module to start the EPUB file's download
      try {
        const downloadedFilePath = await BackgroundDownloadModule.startDownload(
          epubUrl,
          fileName,
        )
        console.log(
          `book ${fileName} has been downloaded to ${downloadedFilePath}`,
        )
        // Unzip the EPUB file
        await unzip(downloadedFilePath, unzipPath)
        console.log('Unzipped to:', unzipPath)
        // Remove the EPUB file to free space
        await RNFS.unlink(downloadedFilePath)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log(`Book ${fileName} already exists. Skipping download...`)
    }
  }
}
