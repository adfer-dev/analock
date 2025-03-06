import React from 'react'
import EpubReader from './EPUBReader'

export const BookDetailScreen: React.FC = ({route}) => {
  const {id} = route.params

  return <EpubReader ebookId={id} />
}

export default BookDetailScreen
