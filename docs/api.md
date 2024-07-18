# User authentication:

create :

-   route: /api/user/create
-   parameters:
    -   name: string with 3 chars minimum
    -   email: string with a valid email
    -   password: string with 6 chars minimum
-   response: 
    - code 200:
        `JSON
{
user: {
    name:string,
    token:string,
    email:string
},
id: string
}` 
    -   code 400:
-   method: POST

login :

-   route: /api/user/login
-   parameters:
    -   email: string with a valid email
    -   password: string with 6 chars minimum
-   responses:
    -   code 200:
    `JSON
{
user: {
    name:string,
    token:string,
    email:string
},
id: string
}`
    -   code 400:
-   method: POST

login-token :

-   route: /api/user/login-token
-   parameters:
    -   token:string
-   responses:
    -   code 200:
    `JSON
{
user: {
    name:string,
    token:string,
    email:string
},
id: string
}`
    -   code 400:
-   method: POST

logout :

-   route: /api/user/auth/logout
-   headers:
    Authorization: bearer
-   responses:
-   method: DELETE

get user by name :

-   route: /api/user/find-by-name/:name
-   responses:
    -   code 200:
    `JSON
{
name:string,
id: string
}`
    -   code 404:
-   method: GET

# Post route

create:
-   route: /api/post/auth/create
-   headers: Authorization: bearer
-   reponses:
    -   code: 200 `JSON 
    {
        title:string,
        text:string,
        user:{
            name:string,
            email:string
        },
        comments: {
            text:string,
            date:number,
            user:{
                name:string,
                email:string
            },
            }[],
        likes:{
            date:number,
            user:{
                name:string,
                email:string
            },
        }[]
    }
    `
-   method: POST