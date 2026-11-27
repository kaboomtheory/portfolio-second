import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

/** Singleton types: no create/duplicate/delete, one fixed document id each. */
const singletonTypes = new Set(['siteSettings', 'homePage', 'aboutPage'])

export default defineConfig({
  projectId: 'ns0czoug',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            S.divider(),
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(
                S.editor()
                  .id('homePage')
                  .schemaType('homePage')
                  .documentId('homePage'),
              ),
            S.listItem()
              .title('About Page')
              .id('aboutPage')
              .child(
                S.editor()
                  .id('aboutPage')
                  .schemaType('aboutPage')
                  .documentId('aboutPage'),
              ),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('statusItem').title('Status Items'),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
