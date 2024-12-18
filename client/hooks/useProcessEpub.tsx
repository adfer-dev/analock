import {useEffect, useState} from 'react'
import {MixedStyleDeclaration} from 'react-native-render-html'
import RNFS from 'react-native-fs'
import xml2js from 'react-native-xml2js'
import {Dimensions} from 'react-native'
import {APP_DOWNLOAD_PATH} from '../services/download.services'

interface ProcessEpubResult {
  htmlContent: string
  loading: boolean
  errorMessage: string
  tagStyles: Readonly<Record<string, MixedStyleDeclaration>> | undefined
  classStyles: Readonly<Record<string, MixedStyleDeclaration>> | undefined
}

const orderedItems: ParsedItem[] = []
let opfPath: string = ''
let contentPath: string = ''

export function useProcessEpub(ebookId: string): ProcessEpubResult {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [tagStyles, setTagStyles] = useState<
    Readonly<Record<string, MixedStyleDeclaration>> | undefined
  >()
  const [classStyles, setClassStyles] = useState<
    Readonly<Record<string, MixedStyleDeclaration>> | undefined
  >()

  useEffect(() => {
    processEpub(
      ebookId,
      setHtmlContent,
      setLoading,
      setTagStyles,
      setClassStyles,
    )
      .then()
      .catch(err => setErrorMessage(err))
  }, [])

  return {
    htmlContent,
    loading,
    errorMessage,
    tagStyles,
    classStyles,
  }
}

async function processEpub(
  ebookId: string,
  setHtmlContent: React.Dispatch<React.SetStateAction<string>>,
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
  const unzipPath = `${APP_DOWNLOAD_PATH}/${ebookId}`
  // Get the opf file path, and set the content path
  opfPath = await getOPFPath(unzipPath)
  contentPath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1)
  // get the items from the opf files
  await getOpfItems(unzipPath + '/' + opfPath)
  const cssPath = orderedItems.find(item => item.mediaType === 'text/css')?.href
  await loadRandomHtmlFile(setHtmlContent, unzipPath)
  const css = await RNFS.readFile(
    `${unzipPath}/${contentPath}${cssPath}`,
    'utf8',
  )
  parseCSS(css, setTagStyles, setClassStyles)
  setLoading(false)
}

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

/*
 * Converts the given CSS declarations to React Native format
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

  // set this so images fit the screen size
  const {width, height} = Dimensions.get('window')
  tagsStyles['img'].resizeMode = 'contain'
  tagsStyles['img'].width = width
  tagsStyles['img'].height = height

  setTagStyles(tagsStyles)
  setClassStyles(classesStyles)
}

function setImagePaths(html: string, unzipFolderPath: string): string {
  const documentDirPath = `file://${unzipFolderPath}/${contentPath}`

  let updatedHtml = html.replace(
    /src="\.\.\/([^"]+)"/g, // Match any path starting with "../" followed by any folder or file name
    (_, relativePath) => {
      const newPath = `${documentDirPath}/${relativePath}`
      return `src="${newPath}"`
    },
  )

  // Handle images at the root (e.g., "src="image.jpg" without any "../")
  updatedHtml = updatedHtml.replace(
    /src="([^/"]+)"/g, // Match paths that don't start with "../" (i.e., root-level images)
    (_, imgName) => {
      const newPath = `${documentDirPath}/${imgName}`
      return `src="${newPath}"`
    },
  )

  return updatedHtml
}

async function loadRandomHtmlFile(
  setHtmlContent: React.Dispatch<React.SetStateAction<string>>,
  unzipFolderPath: string,
): Promise<void> {
  const htmlItems = orderedItems.filter(
    item =>
      item.mediaType === 'text/html' ||
      item.mediaType === 'application/xhtml+xml',
  )
  console.log(htmlItems)
  const randomIndex = Math.floor(Math.random() * htmlItems.length)
  const selectedItem = htmlItems[randomIndex]

  let content = await RNFS.readFile(
    `${unzipFolderPath}/${contentPath}${selectedItem.href}`,
    'utf8',
  )
  content = setImagePaths(content, unzipFolderPath)
  setHtmlContent(content)
}
