import axios from 'axios'

export async function getOpenLibraryBooksBySubject(
  req: OpenLibraryRequest,
): Promise<InternetArchiveBook[]> {
  const GET_BOOKS_QUERY = `https://archive.org/advancedsearch.php?q=collection:opensource+AND+language:english+AND+subject:${req.subject}+AND+mediatype:texts&fl=title,creator,identifier&sort[]=downloads+desc&sort[]=avg_rating+desc&rows=${req.limit}&page=1&output=json`
  let books: InternetArchiveBook[] = []

  await axios({
    url: GET_BOOKS_QUERY,
    method: 'GET',
    responseType: 'json',
  })
    .then(response => {
      const res = response.data.response as OpenLibraryResponse
      books = res.docs
    })
    .catch(err => {
      console.error(err)
    })

  return books
}

export async function getBookMetadata(
  req: InternetArchiveMetadataRequest,
): Promise<InternetArchiveMetadataResponse | null> {
  let result = null
  const getMetadataQuery = `https://archive.org/metadata/${req.id}`

  await axios({
    url: getMetadataQuery,
    method: 'GET',
    responseType: 'json',
  })
    .then(res => {
      result = res.data as InternetArchiveMetadataResponse
    })
    .catch(err => {
      console.error(err)
    })

  return result
}
