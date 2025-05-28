# Gestione Dati Personali

Applicazione web per la gestione dei dati anagrafici delle persone.

## Tecnologie Utilizzate

- Backend: Spring Boot 3.5.0
- Database: H2 (in-memory)
- Frontend: Angular 18

## Accesso al Database H2

Il database è accessibile via browser all'indirizzo:

```
http://localhost:8080/h2-console
```

Credenziali (configurate in `server/src/main/resources/application.properties`):

- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (vuota)

## Funzionalità Implementate

### Lista Persone

- Visualizzazione elenco con Nome, Cognome, Comune ed Email
- Filtri per ogni campo
- Ordinamento dei dati
- Pulsante "Nuova anagrafica"
- Tasto ELIMINA per ogni riga
- Tasto MODIFICA per ogni riga

### Gestione Anagrafica

- Form di inserimento/modifica dati
- Campi obbligatori:
  - Nome
  - Cognome
  - Email
- Campi opzionali:
  - Indirizzo
  - Località
  - Comune
  - Provincia (2 caratteri)
  - Note
- Validazione dei dati
- Evidenziazione del record dopo inserimento/modifica

### Caratteristiche Tecniche

- Navigazione gestita con route Angular
- Design responsive per smartphone e tablet
- Database H2 in-memory per facilità di sviluppo e condivisione
