interface OpenLibraryResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: InternetArchiveBook[];
  num_found: number;
  q?: string;
}

interface InternetArchiveBook {
  identifier: string;
  title: string;
  creator: string;
  epubFile?: string;
}

interface OpenLibraryBook {
  author_key?: string[];
  author_name?: string[];
  contributor?: string[];
  cover_i?: number;
  cover_edition_key: string;
  ddc?: string[];
  ebook_access?: string;
  edition_count?: number;
  edition_key?: string[];
  first_publish_year?: number;
  first_sentence?: string[];
  format?: string[];
  has_fulltext?: boolean;
  ia: string[];
  ia_count?: number;
  ia_collection?: string[];
  isbn: string[];
  key: string;
  language?: string[];
  lcc?: string[];
  lccn?: string[];
  oclc?: string[];
  publish_date?: string[];
  publish_place?: string[];
  publish_year?: number[];
  publisher?: string[];
  subject?: string[];
  redirects?: string;
  title: string;
  id_amazon: string[];
  id_goodreads: string[];
  place?: string[];
  person?: string[];
  ia_loaded_id?: string[];
  subtitle?: string;
  alternative_title?: string[];
  alternative_subtitle?: string[];
  ratings_average?: number;
  ratings_count?: number;
  readinglog_count?: number;
  want_to_read_count?: number;
  currently_reading_count?: number;
  already_read_count?: number;
  publisher_facet?: string[];
  person_key?: string[];
  place_key?: string[];
  person_facet?: string[];
  subject_key?: string[];
  lcc_sort?: string;
  ddc_sort?: string;
}

interface OpenLibraryRequest {
  subject: string;
  sort: string;
  limit: number;
}

interface InternetArchiveMetadataRequest {
  id: string;
}

interface InternetArchiveMetadataResponse {
  files: InternetArchiveFile[];
  metadata: InternetArchiveMetadata;
}

interface InternetArchiveFile {
  name: string;
  format: string;
}

interface InternetArchiveMetadata {
  identifier: string;
  mediatype: string;
  collection: string[];
  description: string;
  scanner: string;
  subject: string[];
  title: string;
  publicdate: string;
  uploader: string;
  addeddate: string;
  language: string;
  "identifier-access": string;
  "identifier-ark": string;
  ppi: string;
  ocr: string;
  repub_state: string;
  curation: string;
  backup_location: string;
}

interface StorageBook {
  id: string;
  data: StorageBookData;
}

interface StorageBookData {
  firstPageIndex: number;
  currentPage: number;
  maxPages: number;
  finished: boolean;
}
