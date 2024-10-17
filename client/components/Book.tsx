import React, {useState} from 'react'
import {Button, View, Text, StyleSheet, ScrollView} from 'react-native'
import EpubReader from './EPUBReader'

export const BookDetailScreen: React.FC = ({route}) => {
  const {id} = route.params

  return <EpubReader ebookId={id} />
}

export default BookDetailScreen
