-   route: /api/user/create
-   parameters (body):

    ```typescript
        {
            name: string,// with 3 chars minimum
            email: string,// with a valid email
            password: string,// with 6 chars minimum
        }
    ```

-   response:
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
