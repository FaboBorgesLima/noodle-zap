# IMPORTANT!!!

**do not run tests in the deployment enviroment !!!**

# Requirements

-   docker engine 26

## Steps

1. copy .env.example to a new file named .env (if not already exists)
1. run `docker compose -f compose.prod.yaml up`

that's it !!! the frontend server will be runing at http://127.0.0.1 and the backend server will be runing at http://127.0.0.1:8080

## Volumes

The aplication has two volumes, one is for monogdb and the other one is for the mysql
