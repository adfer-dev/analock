import {useEffect, useState} from 'react'
import {MixedStyleDeclaration} from 'react-native-render-html'
import RNFS from 'react-native-fs'
import xml2js from 'react-native-xml2js'
import {Dimensions} from 'react-native'
import {APP_DOCUMENTS_PATH} from '../services/download.services'

interface ProcessEpubResult {
  htmlFiles: ParsedItem[]
  htmlCurrentFileIndex: number
  contentPath: string
  loading: boolean
  tagStyles: Readonly<Record<string, MixedStyleDeclaration>> | undefined
  classStyles: Readonly<Record<string, MixedStyleDeclaration>> | undefined
}

const orderedItems: ParsedItem[] = []
let opfPath: string = ''
let contentPath: string = ''

/**
 * Custom hook used to process and load the EPUB file of the ebook
 * whose identifier matches with the id passed by parameter.
 *
 * @param ebookId the identifier of the book to be loaded
 */
export function useProcessEpub(ebookId: string): ProcessEpubResult {
  const [htmlFiles, setHtmlFiles] = useState<ParsedItem[]>([])
  const [htmlCurrentFileIndex, setHtmlCurrentFileIndex] = useState<number>(0)
  const [contentPath, setContentPath] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [tagStyles, setTagStyles] = useState<
    Readonly<Record<string, MixedStyleDeclaration>> | undefined
  >()
  const [classStyles, setClassStyles] = useState<
    Readonly<Record<string, MixedStyleDeclaration>> | undefined
  >()

  useEffect(() => {
    processEpub(
      ebookId,
      setHtmlFiles,
      setHtmlCurrentFileIndex,
      setContentPath,
      setLoading,
      setTagStyles,
      setClassStyles,
    )
      .then()
      .catch(err => console.error(err))
  }, [])

  return {
    htmlFiles,
    htmlCurrentFileIndex,
    contentPath,
    loading,
    tagStyles,
    classStyles,
  }
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
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTagStyles: React.Dispatch<
    React.SetStateAction<
      Readonly<Record<string, MixedStyleDeclaration>> | undefined
    >
  >,
  setClassStyles: React.Dispatch<
    React.SetStateAction<
      Readonly<Record<string, MixedStyleDeclaration>> | undefined
    >
  >,
): Promise<void> {
  const unzipPath = `${APP_DOCUMENTS_PATH}/${ebookId}`
  // Get the opf file path, and set the content path
  opfPath = await getOPFPath(unzipPath)
  contentPath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1)
  setContentPath(contentPath)
  // get the items from the opf files
  await getOpfItems(unzipPath + '/' + opfPath)
  const cssPath = orderedItems.find(item => item.mediaType === 'text/css')?.href
  await loadHtmlFiles(setHtmlFiles)
  //get the CSS file content and convert it to RN format
  const css = await RNFS.readFile(
    `${unzipPath}/${contentPath}${cssPath}`,
    'utf8',
  )
  parseCSS(css, setTagStyles, setClassStyles)
  setLoading(false)
}

/**
 * Gets the OPF file's path. In EPUB files, the OPF file is used as index,
 * having ordered references of its contents.
 *
 * @param unzippedPath the path where the EPUB file was unziped
 * @returns a Promise encapsulating a string that contains the OPF file's path
 */
async function getOPFPath(unzippedPath: string): Promise<string> {
  const containerXMLPath = `${unzippedPath}/META-INF/container.xml`
  let path = ''

  try {
    const containerXML = await RNFS.readFile(containerXMLPath, 'utf8')

    const parser = new xml2js.Parser()

    parser.parseString(
      containerXML,
      (err: Error | undefined, parsedData: ContainerParsedData) => {
        if (err) {
          console.error('Error parsing XML:', err)
          return null
        }

        path = parsedData.container.rootfiles[0].rootfile[0].$['full-path']
      },
    )
  } catch (error) {
    console.error('Error parsing container.xml:', error)
  }

  return path
}

/**
 * Parses the OPF file and sets the Styles, Images and HTML paths
 *
 * @param the OPF file's path'
 */
async function getOpfItems(path: string): Promise<void> {
  // Read the OPF file
  const opfXML = await RNFS.readFile(path, 'utf8')

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

/**
 * Converts the given CSS declarations to React Native format.
 *
 * @param declarations a key-value map containing the CSS properties and its values
 * @returns a MixedStyleDeclarations object that represents the React Native formatted CSS properties
 */
function convertDeclarationsToReactNative(declarations: {
  [key: string]: string
}): MixedStyleDeclaration {
  const reactNativeStyles: MixedStyleDeclaration = {}
  // raw css styles that can be replaced in react native
  const reactNativeReplacements: Map<string, string> = new Map()
  // raw css styles that cannot be replaced in react native
  const reactNativeNonReplaceableProperties: string[] = []
  reactNativeReplacements.set('textIndent', 'paddingLeft')
  reactNativeNonReplaceableProperties.push('oebColumnNumber')
  reactNativeNonReplaceableProperties.push('clip')
  reactNativeNonReplaceableProperties.push('columnCount')
  reactNativeNonReplaceableProperties.push('breakInside')

  for (const property in declarations) {
    let camelCasedProperty = property.replace(/-([a-z])/g, g =>
      g[1].toUpperCase(),
    )

    if (reactNativeReplacements.get(camelCasedProperty)) {
      camelCasedProperty = reactNativeReplacements.get(
        camelCasedProperty,
      ) as string
    }

    if (!reactNativeNonReplaceableProperties.includes(camelCasedProperty)) {
      const value = declarations[property].endsWith('px')
        ? parseFloat(declarations[property])
        : declarations[property]
      reactNativeStyles[camelCasedProperty] = value
    }
  }

  return reactNativeStyles
}

/*
 * Parses the given CSS content and sets the styles for RenderHTML component
 */
function parseCSS(
  css: string,
  setTagStyles: React.Dispatch<
    React.SetStateAction<
      Readonly<Record<string, MixedStyleDeclaration>> | undefined
    >
  >,
  setClassStyles: React.Dispatch<
    React.SetStateAction<
      Readonly<Record<string, MixedStyleDeclaration>> | undefined
    >
  >,
): void {
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

  // default styles for images
  const {width, height} = Dimensions.get('window')
  tagsStyles['img'].resizeMode = 'contain'
  tagsStyles['img'].width = width
  tagsStyles['img'].height = height

  //default styles for paragraphs
  tagsStyles['p'].lineHeight = 28
  tagsStyles['p'].textAlign = 'justify'
  tagsStyles['p'].letterSpacing = 0.2
  tagsStyles['p'].padding = 0

  setTagStyles(tagsStyles)
  setClassStyles(classesStyles)
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
    item =>
      item.mediaType === 'text/html' ||
      item.mediaType === 'application/xhtml+xml',
  )
  setHtmlFiles(htmlItems)
}
