# Dev requirements

-   node 20
-   docker 26

# Dev setup

-   backend:

    -   copy .env.example to a .env file
    -   run `npm i` for installing packages in the backend folder

-   frontend:
    -   run `npm i` for installing packages in the frontend folder

# Running development setup

-   backend:

    -   run `docker compose watch` for watching
    -   and `docker compose up` for attaching the terminal
    -   and in another terminal`docker compose watch`

-   frontend:
    -   run `npm run dev` in frontend folder

for more details look at the [docs](/docs/)
