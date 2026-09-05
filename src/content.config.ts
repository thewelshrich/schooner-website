import { defineCollection, z } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { i18nSchema } from '@astrojs/starlight/schema'
import { docsSchema } from '@astrojs/starlight/schema'

export const collections = {
  i18n: defineCollection({ schema: i18nSchema() }),
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema({ extend: z.object({ lead: z.string().optional() }) }) }),
}
