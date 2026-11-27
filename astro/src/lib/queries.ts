/**
 * GROQ queries, copied from the Nuxt server routes (server/api/sanity-*.get.ts)
 * so both sites read the same shape while they run side by side.
 */

/**
 * Public project list. Password hashes are NOT returned here. Protected and
 * under-construction projects have their `sections` stripped.
 */
export const projectsIndexQuery = `*[_type == "project" && defined(slug.current)]|order(order asc, name asc){
  _id,
  _type,
  name,
  slug,
  summary,
  thumbnail,
  protected,
  underConstruction,
  tags,
  "sections": select(
    protected == true => null,
    underConstruction == true => null,
    sections
  ),
  client,
  role,
  projectUrl,
  heroImage,
  color,
  collaborators,
  order
}`

export const homePageQuery = `*[_type == "homePage" && _id == "homePage"][0]{
  title,
  taglines,
  intro,
  email,
  socialLinks
}`

export const aboutPageQuery = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  hero,
  story,
  experiences,
  capabilities,
  resumeUrl
}`

export const statusItemsQuery = `*[_type == "statusItem"]|order(order asc){
  _id,
  label,
  title,
  content,
  link,
  image,
  icon,
  order
}`
