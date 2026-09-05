import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://schooner.sh',
  output: 'static',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  integrations: [
    starlight({
      title: 'Schooner',
      description: 'Learn to set up persistent remote development with Schooner, SSH, Git, and tmux.',
      favicon: '/favicon.ico',
      customCss: ['./src/styles/docs.css'],
      components: { SiteTitle: './src/components/docs/SiteTitle.astro', PageTitle: './src/components/docs/PageTitle.astro' },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/thewelshrich/schooner' }],
      sidebar: [
        { label: 'Start here', items: [
          { label: 'Introduction', slug: 'docs' },
          { label: 'Installation', slug: 'docs/installation' },
          { label: 'Your first remote session', slug: 'docs/first-session' },
          { label: 'Resume your work', slug: 'docs/resume' },
        ] },
        { label: 'Daily work', items: [
          { label: 'Transfer your workspace', slug: 'docs/workspace-sync' },
          { label: 'Sessions and shells', slug: 'docs/sessions' },
          { label: 'Repositories and worktrees', slug: 'docs/repositories' },
          { label: 'Command defaults', slug: 'docs/command-basics' },
        ] },
        { label: 'Machines and access', items: [
          { label: 'Manage your Boxes', slug: 'docs/boxes' },
          { label: 'Provision a machine', slug: 'docs/provisioning' },
          { label: 'GitHub access', slug: 'docs/source-access' },
        ] },
        { label: 'Reference', items: [
          { label: 'Command reference', slug: 'docs/command-reference' },
          { label: 'Automation', slug: 'docs/automation' },
          { label: 'Troubleshooting', slug: 'docs/troubleshooting' },
        ] },
        { label: 'Project', items: [
          { label: 'Roadmap ↗', link: 'https://github.com/thewelshrich/schooner/blob/main/docs/roadmap.md' },
          { label: 'Support ↗', link: 'https://github.com/thewelshrich/schooner/blob/main/SUPPORT.md' },
        ] },
      ],
      expressiveCode: { themes: ['github-dark', 'github-light'], defaultProps: { frame: 'none', wrap: true }, styleOverrides: { borderRadius: '0.25rem', codeBackground: ({ theme }) => theme.type === 'dark' ? '#03090c' : '#f0f5f3', borderColor: ({ theme }) => theme.type === 'dark' ? '#294047' : '#c1d2d1' } },
      credits: false,
    }),
  ],
})
