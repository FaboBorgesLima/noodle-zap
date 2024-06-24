# User authentication:

create :

-   route: /api/user/create
-   parameters:
    -   name: string with 3 chars minimum
    -   email: string with a valid email
    -   password: string with 6 chars minimum
-   response:
    -   user:
        -   name:string
        -   token:string
        -   email:string
    -   id: string

login :

-   route: /api/user/login
-   parameters:
    -   email: string with a valid email
    -   password: string with 6 chars minimum
-   response:
    -   user:
        -   name:string
        -   token:string
        -   email:string
    -   id: string

login-token :

-   route: /api/user/login-token
-   parameters:
    -   token:string
-   response:
    -   user:
        -   name:string
        -   token:string
        -   email:string
    -   id: string

logout :

-   route: /api/user/auth/logout
-   headers:
    Authorization: bearer
-   response:
    ok or 400;
