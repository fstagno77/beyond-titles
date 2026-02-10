# Autenticazione

## Panoramica

Beyond Titles non implementa un sistema di autenticazione utente tradizionale. Non esistono account, login o sessioni server-side. L'unico meccanismo di accesso controllato riguarda la survey SJT v1.0, protetta da password.

## Accesso Pubblico

Tutte le funzionalità sono liberamente accessibili:

- Survey Behavioural & Competency-Based
- System Activity Log
- Changelog

## Protezione Survey SJT

La survey Situational Judgement Test v1.0 è in fase di sviluppo ed è protetta da una password hardcoded.

### Flusso di Accesso

```
Utente seleziona SJT v1.0 dal selettore
    ↓
Controllo localStorage('beyond-titles-sjt-auth')
    ├── === 'true' → Avvia survey (skip modale)
    └── !== 'true' → Mostra modale password
                         ↓
                     Utente inserisce password
                         ↓
                     Validazione: input === 'gigroup2026'
                         ├── Corretta → localStorage.set('beyond-titles-sjt-auth', 'true')
                         │              → Avvia survey
                         └── Errata → Mostra errore, consenti retry
```

### Dettagli Implementativi

| Aspetto | Dettaglio |
|---|---|
| Password | `gigroup2026` (hardcoded in `survey.js`) |
| Persistenza | `localStorage` chiave `beyond-titles-sjt-auth` |
| Scadenza | Nessuna (valida finché non si cancella localStorage) |
| Rate limiting | Nessuno |
| Crittografia | Nessuna |

::: warning Sicurezza
La password è visibile nel codice sorgente client-side. Questo è intenzionale per un prototipo — in produzione serve un meccanismo server-side.
:::

## Ruoli e Permessi

Non esistono ruoli utente nel sistema attuale. La distinzione è solo tra:

| Livello | Accesso |
|---|---|
| Pubblico | Survey Behavioural & Competency-Based, risultati |
| SJT (post password) | Tutto il pubblico + Survey SJT v1.0 |
