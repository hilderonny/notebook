# notebook

Notizbuchfunktionen für meine NodeJS Framework-Anwendungen.

Verwendet [LocalDb](https://gogs.levelupsoftware.de/levelupsoftware/localdb).
Benötigt [Db](https://gogs.levelupsoftware.de/levelupsoftware/db) und [Auth](https://gogs.levelupsoftware.de/levelupsoftware/auth).

```js
var db = require('@levelupsoftware/db');
var auth = require('@levelupsoftware/auth');
var notebook = require('@levelupsoftware/notebook');

await notebook.init(app, db, auth);
```

## Datenbanktabellen

### book

|Spalte|Datentyp|
|---|---|
|user|varchar(255) not null|
|title|varchar(255)|
|currentpage|varchar(255)|
|lastmodified|bigint not null|
|image|mediumtext|

### page

|Spalte|Datentyp|
|---|---|
|user|varchar(255) not null|
|book|varchar(255) not null|
|data|mediumtext|
|lastmodified|bigint not null|

## APIs

|Endpunkt|Beschreibung|
|---|---|
|/api/notebook/book/get|Buch mit allen Details laden|
|/api/notebook/book/list|Ids und Änderungszeitpunkt aller Bücher des angemeldeten Benutzers laden|
|/api/notebook/book/save|Buch speichern|
|/api/notebook/page/get|Seite mit allen Details laden|
|/api/notebook/page/list|Ids und Änderungszeitpunkt aller Seiten aller Bücher des angemeldeten Benutzers laden|
|/api/notebook/page/save|Seite speichern|

## Statische Ressourcen

|Ressource|Beschreibung|
|---|---|
|/static/notebook/Notebook.js|Manipulieren von Büchern und Seiten|
|/static/notebook/Pencil.js|Stifteingabe für iPad|

## Client-Funktionen

|Funktion|Bedeutung|
|---|---|
|Notebook.init(auth, userid)||
|Notebook.addbook()||
|Notebook.addpage(bookid)||
|Notebook.loadbooks()||
|Notebook.loadbook(bookid)||
|Notebook.loadpage(pageid)||
|Notebook.loadpages()||
|Notebook.savebook(book)||
|Notebook.savepage(page)||
|Notebook.synchronize()||
|Pencil.init(canvas, config, usetouch)|

## Client-Events

|Event|Bedeutung|
|---|---|
|pagechanged|Die aktuell bearbeitete Seite wurde bearbeitet. Kommt von Pencil|
