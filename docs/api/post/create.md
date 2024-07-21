# create post

this route will create a post using the user auth token, title and text

-   route: /api/post/auth/create
-   headers: Authorization: bearer
-   params (body):
    ```typescript
    {
        title:string,
        text:string
    }
    ```
-   reponses:
    -   code 200:
    ```typescript
    {
        title:string,
        text:string,
        user:{
            name:string,
        },
        comments: {
            text:string,
            date:number,
            user:{
                name:string,
            },
            }[],
        likes:{
            date:number,
            user:{
                name:string,
            },
        }[]
    }
    ```
-   method: POST
