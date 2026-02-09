import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Beyond Titles',
  description: 'POC per la Digital Platform progetto Gi Group',
  lang: 'it-IT',
  base: '/wiki/',
  outDir: '../wiki',

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
          { text: 'BCB v3.4', link: '/guide/survey-v3' },
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
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Cerca', buttonAriaLabel: 'Cerca' },
          modal: {
            noResultsText: 'Nessun risultato per',
            resetButtonTitle: 'Cancella ricerca',
            footer: { selectText: 'per selezionare', navigateText: 'per navigare' }
          }
        }
      }
    }
  }
})
