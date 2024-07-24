# Backend

for backend testing, with the `docker compose up` and `docker compose watch` runing, exec:

```shell
    docker compose run backend npm run test
```

if testing is executed outside the container some erros can happen, like trying to read env vars that does not exist.
