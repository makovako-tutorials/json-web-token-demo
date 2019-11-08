## JWT Autorization

Following tutorial from this [video](https://www.youtube.com/watch?v=mbsmsi7l3r4)

Two servers

- one for getting data, port 6000
- one for authorization, port 7000

access token expires in 15 seconds, needs to be refreshed with refresh token

logout deletes refresh token form DB

API requests are in reqeust.rest file, needs vscode extension *REST Client*

Generate some access and refresh token secrets with ```require('crypto').randomBytes(64).toString('hex');``` in js console and save them in .env file