# create post

this route will delete a comment using the user auth token, postId and commentId

-   route: /api/comment/auth/delete/:postId/:commentid
-   headers: Authorization: bearer
-   params (url):
    -   postId: hex string
    -   commentId: hex string
-   reponses:
    -   code 200
    -   code 400
    -   code 403
-   method: DELETE
