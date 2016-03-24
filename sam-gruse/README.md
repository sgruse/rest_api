##March 23rd 2016:

This is my updated '2 RESOURCE RESTFUL API' with an upgraded authentication layer which requires a user to be verified and a 'user token' to be present during all 'song' and 'artist' route requests.  My mocha tests begin by creating a user, logging in with that user, and then using that newly created user's 'user token' to proceed with all route requests.

The curl commands to create a new user are as followed:

#CREATE USER:

curl -X POST --data '{"name":"boo", "password":"dog"}' localhost:3000/public/createUser

#LOGIN WITH THAT USER:

curl -X POST -u boo:dog localhost:3000/login/login

#MAKE A REQUEST TO A ROUTE USING GENERATED USER TOKEN

curl -X GET -H 'Authorization: token myToken' localhost:3000/api/songs

NOTE: A user token is generated and sent back after hitting the login route.  Use this token to replace the 'myToken' string inside of the above curl route.
