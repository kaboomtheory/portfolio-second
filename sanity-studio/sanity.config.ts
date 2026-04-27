import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

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
  },
})
