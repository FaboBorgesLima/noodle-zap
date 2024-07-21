-   route: /api/user/login-token
-   parameters:
    -   token:string
-   responses:
    -   code 200:
    ```typescript
    {
        user: {
            name:string,
            token:string,
            email:string
        },
        id: string
    }
    ```
    -   code 400:
-   method: POST