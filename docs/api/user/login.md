-   route: /api/user/login
-   parameters:
    -   email: string with a valid email
    -   password: string with 6 chars minimum
-   responses:
    -   code 200:
    ```typescript
    {
        user: {
            name:string,
            token:string,
            id: string,
            email:string
        },
    }
    ```
    -   code 400:
-   method: POST
