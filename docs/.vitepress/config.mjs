import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Beyond Titles',
  base: '/wiki/',
  outDir: '../wiki',
  appearance: 'force-dark',
  head: [['link', { rel: 'icon', href: '/wiki/favicon.jpg' }]],

  locales: {
    root: {
      label: 'Italiano',
      lang: 'it-IT',
      description: 'POC per la Digital Platform progetto Gi Group',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guida', link: '/guide/architettura' },
          { text: 'Changelog', link: '/changelog/' },
          { text: 'Decisioni', link: '/decisioni/' }
        ],

        sidebar: [
          {
            text: 'Introduzione',
            items: [
              { text: 'Panoramica', link: '/' }
            ]
          },
          {
            text: 'Guida',
            items: [
              { text: 'Architettura', link: '/guide/architettura' },
              { text: 'Database', link: '/guide/database' },
              { text: 'Autenticazione', link: '/guide/autenticazione' },
              { text: 'Componenti', link: '/guide/componenti' },
              { text: 'Deploy', link: '/guide/deploy' }
            ]
          },
          {
            text: 'Modello',
            items: [
              { text: 'Modello K8', link: '/guide/modello-k8' },
              { text: 'BCB v4.0', link: '/guide/survey-v3' },
              { text: 'Bilanciamento v4.0', link: '/guide/bilanciamento-v4' },
              { text: 'Pipeline Dati', link: '/guide/pipeline-dati' }
            ]
          },
          {
            text: 'Progetto',
            items: [
              { text: 'Changelog', link: '/changelog/' },
              { text: 'Decisioni (ADR)', link: '/decisioni/' }
            ]
          }
        ],

        outline: {
          label: 'In questa pagina'
        },

        docFooter: {
          prev: 'Pagina precedente',
          next: 'Pagina successiva'
        }
      }
    },

    en: {
      label: 'English',
      lang: 'en',
      description: 'POC for the Gi Group Digital Platform project',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/architecture' },
          { text: 'Changelog', link: '/en/changelog/' },
          { text: 'Decisions', link: '/en/decisions/' }
        ],

        sidebar: [
          {
            text: 'Introduction',
            items: [
              { text: 'Overview', link: '/en/' }
            ]
          },
          {
            text: 'Guide',
            items: [
              { text: 'Architecture', link: '/en/guide/architecture' },
              { text: 'Database', link: '/en/guide/database' },
              { text: 'Authentication', link: '/en/guide/authentication' },
              { text: 'Components', link: '/en/guide/components' },
              { text: 'Deploy', link: '/en/guide/deploy' }
            ]
          },
          {
            text: 'Model',
            items: [
              { text: 'K8 Model', link: '/en/guide/k8-model' },
              { text: 'BCB v4.0', link: '/en/guide/survey-v3' },
              { text: 'Balance v4.0', link: '/en/guide/balance-v4' },
              { text: 'Data Pipeline', link: '/en/guide/data-pipeline' }
            ]
          },
          {
            text: 'Project',
            items: [
              { text: 'Changelog', link: '/en/changelog/' },
              { text: 'Decisions (ADR)', link: '/en/decisions/' }
            ]
          }
        ],

        outline: {
          label: 'On this page'
        },

        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        }
      }
    }
  },

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Cerca', buttonAriaLabel: 'Cerca' },
              modal: {
                noResultsText: 'Nessun risultato per',
                resetButtonTitle: 'Cancella ricerca',
                footer: { selectText: 'per selezionare', navigateText: 'per navigare' }
              }
            }
          },
          en: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Clear search',
                footer: { selectText: 'to select', navigateText: 'to navigate' }
              }
            }
          }
        }
      }
    }
  }
})
