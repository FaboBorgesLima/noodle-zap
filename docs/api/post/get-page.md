# get page

this route will recive an auth token, page and pageSize.

## examples

if you use the paramters page=0 and pageSize = 10 it will returns the posts(if exists) from 0 to 9.

if you use the parameters page=1 and pageSize = 10 it will returns the posts(if exits) from 10 to 19.

-   route: /api/post/auth/page/:page/:pageSize
-   method: GET
-   params (url):
    -   page:int
    -   pageSize:int
-   headers:
    -   Authorization: bearer
-   response:
    -   code 200:
    ```typescript
    {
        posts:{
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
    }
    ```
