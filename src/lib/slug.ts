// URL slug for a title: lowercase, runs of anything else become one '-', trimmed.
// Same rule as the resume site's lab anchors, so old links map cleanly.
export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
