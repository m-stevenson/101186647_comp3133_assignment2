# COMP3133 Assignment 2 - 101186647

## Run with

`docker compose up -d --build`

in 101186647_comp3133_assignment2/

## Test user query

`{
  "query": "mutation Signup($username: String!, $email: String!, $password: String!) { signup(username: $username, email: $email, password: $password) { user { _id username email } token } }",
  "variables": {
    "username": "101186647",
    "email": "101186647@email.com",
    "password": "password123"
  }
}`

Login with username: 101186647, password: password123
