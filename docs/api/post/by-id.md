# create post

this route will create a post using the user auth token, title and text

-   route: /api/post/by-id/:id
-   params (url):

    -   id: post id

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
-   method: GET
