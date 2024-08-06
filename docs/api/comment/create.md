# create post

this route will create a comment using the user auth token, text and postId

-   route: /api/comment/auth/create
-   headers: Authorization: bearer
-   params (body):
    ```typescript
    {
        postId:string,
        text:string
    }
    ```
-   reponses:
    -   code 200:
    ```typescript
    {
        id:string,
        text:string,
        user:{
            name:string,
        },
        date:number
    }
    ```
-   method: POST
