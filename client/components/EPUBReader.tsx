import React from 'react'
import {ActivityIndicator, Text, ScrollView, Dimensions} from 'react-native'
import RenderHTML from 'react-native-render-html'
import {useProcessEpub} from '../hooks/useProcessEpub'

interface EpubReaderProps {
  ebookId: string
}

const EpubReader: React.FC<EpubReaderProps> = ({ebookId}) => {
  const {width} = Dimensions.get('window')
  const {htmlContent, errorMessage, loading, tagStyles, classStyles} =
    useProcessEpub(ebookId)

  if (errorMessage) {
    return <Text>{errorMessage}</Text>
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
      }}>
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
