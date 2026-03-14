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
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('statusItem').title('Status Items'),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
