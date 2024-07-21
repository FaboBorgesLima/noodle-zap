-   route: /api/user/find-by-name/:name
-   responses:
    -   code 200:
    ```typescript
    {
        name:string,
        id: string
    }
    ```
    -   code 404:
-   method: GET