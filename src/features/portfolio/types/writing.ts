export type Writing = {
  /** Stable unique identifier (used as list key). */
  id: string
  title: string
  /** Public URL of the article. */
  link: string
  /** Where the article was published, e.g. "微信公众号". */
  publisher?: string
  /** One-line summary shown under the title. */
  description?: string
}
