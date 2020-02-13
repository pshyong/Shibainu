# Shibainu
An anonymous forum featuring subpages that people can create out of their will!

## Requirements
As all code are compiled and tested with these so no guarantee older version will work
- npm^6.13
- nodejs^12.14.1
- PostgreSQL^11 // Recommend 12 and higher

## Environments
All enviornmental variables (i.e. ports, database credentials) will go into the dotenv file

## How to start
If first time cloning the repo, we will need to download all dependencies, simply perform the following commands
```
npm install
npm start
```
We do **recommend** you develop with nodemon which provides easability, and it will be included in development environment.
Once nodemon is installed, simply perform the following commands
```
npm install
nodemon start
```
After running the above command, your webserver will now be started. By default we will be using port **3000** so connect using http://localhost:3000

## ExpressJS
Will be mainly using expressjs for its middleware and page routing

## Api Routes
We have a dedicated api page through /api-docs

## Note
- You must develop everything in feature/issue-tag and only merge to develop when done and only submit pull request if you know its working so at least 2 of us can review the code
