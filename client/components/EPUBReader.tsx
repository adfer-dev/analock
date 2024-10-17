import React, {useEffect, useState} from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  Alert,
  useWindowDimensions,
  ScrollView,
} from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import {unzip} from 'react-native-zip-archive'
import RenderHTML, {MixedStyleDeclaration} from 'react-native-render-html'
import xml2js from 'react-native-xml2js'
import {getBookMetadata} from '../services/books.services'

interface EpubReaderProps {
  ebookId: string
}

const EpubReader: React.FC<EpubReaderProps> = ({ebookId}) => {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const {width} = useWindowDimensions()
  const [tagStyles, setTagStyles] = useState<
    Readonly<Record<string, MixedStyleDeclaration>> | undefined
  >()
  const [classStyles, setClassStyles] = useState<
    Readonly<Record<string, MixedStyleDeclaration>> | undefined
  >()
  const orderedItems: ParsedItem[] = []
  let opfPath: string = ''
  let contentPath: string = ''
  let unzippedFolderPath = ''

  async function downloadAndUnzipEpub() {
    const metadata = await getBookMetadata({id: ebookId})
    const fileName = metadata?.files.find(file => file.format === 'EPUB')?.name
    const epubUrl = `https://archive.org/download/${ebookId}/${fileName}`
    const downloadPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${ebookId}.epub`
    const unzipPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${ebookId}`

    if (epubUrl !== undefined) {
      try {
        // Step 1: Download the EPUB file
        const response = await RNFetchBlob.config({
          path: downloadPath,
          fileCache: true,
        }).fetch('GET', epubUrl)
        console.log(`Book downloaded ${response.path()}`)

        const epubFilePath = response.path()

        // Step 2: Unzip the EPUB file
        unzippedFolderPath = await unzip(epubFilePath, unzipPath)
        console.log('Unzipped to:', unzippedFolderPath)
        // Get the opf file path, and set the content path
        opfPath = await getOPFPath(unzippedFolderPath)
        contentPath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1)
        // get the items from the opf files
        await getOpfItems(unzippedFolderPath + '/' + opfPath)
        const cssPath = orderedItems.find(
          item => item.mediaType === 'text/css',
        )?.href
        await loadRandomHtmlFile()
        const css = await RNFetchBlob.fs.readFile(
          `${unzippedFolderPath}/${contentPath}${cssPath}`,
          'utf8',
        )
        parseCSS(css)
        setLoading(false)
      } catch (error) {
        console.error('Failed to process EPUB:', error)
        setErrorMessage('Failed to process the EPUB file.')
        setLoading(false)
        Alert.alert('Error', 'There was an error processing the EPUB file.')
      }
    }
  }

  /*
   * Parses the container.xml file and gets the path of the OPF file
   */
  async function getOPFPath(unzippedPath: string): Promise<string> {
    const containerXMLPath = `${unzippedPath}/META-INF/container.xml`
    let path = ''

    try {
      const containerXML = await RNFetchBlob.fs.readFile(
        containerXMLPath,
        'utf8',
      )

      const parser = new xml2js.Parser()

      parser.parseString(
        containerXML,
        (err: Error | undefined, parsedData: ContainerParsedData) => {
          if (err) {
            console.error('Error parsing XML:', err)
            return null
          }

          path = parsedData.container.rootfiles[0].rootfile[0].$['full-path']
          console.log('OPF file path:', path)
        },
      )
    } catch (error) {
      console.error('Error parsing container.xml:', error)
    }

    return path
  }

  /*
   * Parses the OPF file and sets the Styles, Images and HTML paths
   */
  async function getOpfItems(path: string): Promise<void> {
    // Read the OPF file
    const opfXML = await RNFetchBlob.fs.readFile(path, 'utf8')

    // Create a parser instance
    const parser = new xml2js.Parser()

    // Parse the XML content using a promise
    const parsedData: OPFParsedData = await new Promise((resolve, reject) => {
      parser.parseString(
        opfXML,
        (err: Error | undefined, result: OPFParsedData) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        },
      )
    })

    const itemrefs: ItemRef[] = parsedData.package.spine[0].itemref
    const items: OPFManifestItem[] = parsedData.package.manifest[0].item
    for (const itemRef of itemrefs) {
      for (const item of items) {
        const {id, href, 'media-type': mediaType} = item.$

        if (id === itemRef.$.idref) {
          const parsedItem: ParsedItem = {
            id,
            href,
            mediaType,
          }
          orderedItems.push(parsedItem)
          break
        }
      }
    }

    for (const item of items) {
      const {id, href, 'media-type': mediaType} = item.$

      if (mediaType === 'text/css') {
        const parsedItem: ParsedItem = {
          id,
          href,
          mediaType,
        }
        orderedItems.push(parsedItem)
      }
    }
  }

  /*
   * Converts the given CSS declarations to React Native format
   */
  function convertDeclarationsToReactNative(declarations: {
    [key: string]: string
  }): MixedStyleDeclaration {
    const reactNativeStyles: MixedStyleDeclaration = {}

    for (const property in declarations) {
      const camelCasedProperty = property.replace(/-([a-z])/g, g =>
        g[1].toUpperCase(),
      )
      const value = declarations[property].endsWith('px')
        ? parseFloat(declarations[property])
        : declarations[property]
      reactNativeStyles[camelCasedProperty] = value
    }

    return reactNativeStyles
  }

  /*
   * Parses the given CSS content and sets the styles for RenderHTML component
   */
  function parseCSS(css: string): void {
    const tagsStyles: Record<string, MixedStyleDeclaration> = {}
    const classesStyles: Record<string, MixedStyleDeclaration> = {}

    // Split the CSS content by line
    const rules = css.split('}')

    rules.forEach(rule => {
      // Split the selector and declarations
      const [selector, declarations] = rule.split('{')

      if (selector && declarations) {
        const trimmedSelector = selector.trim()
        const trimmedDeclarations = declarations.trim().replace(';', '')

        // Create an object for declarations
        const declarationsObject: {[key: string]: string} = {}
        trimmedDeclarations.split(';').forEach(decl => {
          const [prop, value] = decl.split(':').map(s => s.trim())
          if (prop && value) {
            declarationsObject[prop] = value
          }
        })

        // Determine if it's a class or a tag selector
        if (/^\.[a-zA-Z]+$/.test(trimmedSelector)) {
          const className = trimmedSelector.slice(1) // Remove the dot
          classesStyles[className] =
            convertDeclarationsToReactNative(declarationsObject)
        } else {
          tagsStyles[trimmedSelector] =
            convertDeclarationsToReactNative(declarationsObject)
        }
      }
    })

    setTagStyles(tagsStyles)
    setClassStyles(classesStyles)
  }

  function setImagePaths(html: string): string {
    const documentDirPath = `file://${unzippedFolderPath}/${contentPath}`

    let updatedHtml = html.replace(
      /src="\.\.\/([^"]+)"/g, // Match any path starting with "../" followed by any folder or file name
      (match, relativePath) => {
        const newPath = `${documentDirPath}/${relativePath}`
        return `src="${newPath}"`
      },
    )

    // Handle images at the root (e.g., "src="image.jpg" without any "../")
    updatedHtml = updatedHtml.replace(
      /src="([^/"]+)"/g, // Match paths that don't start with "../" (i.e., root-level images)
      (match, imgName) => {
        const newPath = `${documentDirPath}/${imgName}`
        return `src="${newPath}"`
      },
    )

    return updatedHtml
  }

  async function loadRandomHtmlFile(): Promise<void> {
    const htmlItems = orderedItems.filter(
      item =>
        item.mediaType === 'text/html' ||
        item.mediaType === 'application/xhtml+xml',
    )

    const randomIndex = Math.floor(Math.random() * htmlItems.length)
    const selectedItem = htmlItems[randomIndex]

    let content = await RNFetchBlob.fs.readFile(
      `${unzippedFolderPath}/${contentPath}${selectedItem.href}`,
      'utf8',
    )
    content = setImagePaths(content)
    setHtmlContent(content)
  }

  useEffect(() => {
    downloadAndUnzipEpub()
  }, [])

  if (errorMessage) {
    return <Text>{errorMessage}</Text>
  }

  return (
    <ScrollView style={{flex: 1, padding: 20}}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!loading && (
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
  )
}

export default EpubReader
