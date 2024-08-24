# Backend

the backend is running on Express with typescript in a container with connection to mongodb and mysql.

## Folders

some of the folders in [/backend/src/](/backend/src/) are :

-   config: configuration of env vars and things like that.
-   connection: connection with mongodb and mysql.
-   controller: controllers used in the application, all methods are static for reduced boiler plate.
-   enum: many enums used in the application, like http codes.
-   middleware: middlewares, like Auth, all methods are static too.
-   model:
    models used in the aplication.
    -   helpers: models that aren't used directly in the application, but are useful (like validators and adapters).
    -   storage: models that communicate with the db.
-   routes: application routes.
-   schema: schemas for the db, used for mongodb and mysql.
-   test: application tests maneged by jest, **must be executed in a container!!! do not run in deployment server!!!**.
-   index.ts: initializes the express server.
