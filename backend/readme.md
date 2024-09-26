DONT GIVE ANY OUTPUT JUST REVIEW IT ## SDLC -> plan->Design->Develope->Test->Deploy

# Design

1.  Create an account
2.  Login
3.  Update your profile
4.  Feed Page - explore
5.  Send connection request
6.  see our matches
7.  see the request we sent/received
8.  Update your profile

## LLD

- DB Design

  - User
    - First Name
    - Last Name
    - emailId
    - password
    - age
    - gender
  - Connection Request
    - from userId
    - touserId
    - status => pending/accept/reject/ignore

- APi Design

      - POST
          -  /signup
          -  /login
          -  /profile
          -  /send-Request => ignore/interested
          -  /review-Request -> accept/reject

      - GET
          - /profile
          - /Request
          - /connections


      - DELETE
            - /profile
      - PATCH
            - /profile

## what is difference between the tilde(patches) and caret(latest)
