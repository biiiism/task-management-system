TASK MANAGEMENT SYSTEM
CMS3407 Web and Network Services, Coursework 2

This is a small task manager built with Node.js and Express. It has an API Gateway and two microservices. The client only talks to the gateway (port 3000), and the gateway forwards each request to the User Service (port 3001) or the Task Service (port 3002). Each service keeps its data in its own JSON file, which I used as a simple No-SQL database.


WHAT IS IN THE SUBMISSION

- API_Gateway_Code.zip contains gateway.js
- Server_Code.zip contains task-service.js and user-service.js
- Client_Code.zip contains client.js
- NoSQL_Database.zip contains tasks.json and users.json
- curl_tests.txt has every cURL test with the expected and actual result
- Portfolio_Report.pdf is the report
- README.txt is this file


WHAT YOU NEED

A Windows computer with Node.js 18 or newer (download it from nodejs.org). To check, open PowerShell and type:

    node -v


HOW TO RUN IT

Note: Do not double-click .js files to run them. Open the project folder in Visual Studio Code and run the JavaScript files using Node.js commands in the terminal.
When you double-click client.js, Windows tries to open it with Windows Script Host, which causes the syntax error in your screenshot.

1. Extract the files. Make a new empty folder, for example C:\task-system, and extract all four zip files into it. When you finish, gateway.js, task-service.js, user-service.js, client.js, tasks.json and users.json should all be in that same folder. The two services read their JSON file from the folder they sit in, so please keep them together.

2. Open PowerShell in that folder. In File Explorer, click the address bar at the top of the folder, type powershell and press Enter.

 
3. Install Express (only needed once):

    npm init -y
    npm install express

4. Start the three servers. Each one needs its own PowerShell window, opened in the same folder as in step 2. Start them in this order:

    node user-service.js

    node task-service.js

    node gateway.js

You should see these three messages, one in each window:

    User Service running on port 3001
    Task Service running on port 3002
    API Gateway running on port 3000

5. Run the client. Open a fourth PowerShell window in the same folder and type:

    node client.js


WHAT THE CLIENT DOES

client.js sends every request to http://localhost:3000, so it only ever talks to the gateway. It does four things:

1. Creates, lists, updates and deletes a user.
2. Creates, lists, updates and deletes a task.
3. Sends three bad requests on purpose: a task with no title (400), a task ID that does not exist (404) and a misspelt route (404).
4. Prints the status code and the reply for each request.

The client deletes everything it creates, so the JSON files end up the way they started. If the gateway is not running, it prints a message saying so instead of crashing.


THE API

All requests go to the gateway on port 3000.

Tasks:

- GET /tasks returns all tasks (200)
- POST /tasks with {"title":"Buy milk"} adds a task (201)
- PUT /tasks/1 with {"completed":true} updates task 1 (200)
- DELETE /tasks/1 removes task 1 (200)

Users:

- GET /users returns all users (200)
- POST /users with {"name":"Alice","email":"alice@example.com"} adds a user (201)
- PUT /users/1 with {"name":"Alice Updated"} updates user 1 (200)
- DELETE /users/1 removes user 1 (200)

Errors:

- A missing field on POST gives 400 Bad Request.
- An ID that does not exist on PUT or DELETE gives 404 Not Found.
- A route that does not exist, such as /tassks, gives 404 from the gateway.
- If a service is not running, the gateway gives 502 Bad Gateway.


TESTING WITH CURL

The tests are in curl_tests.txt. I used curl.exe instead of curl, because in PowerShell curl is a shortcut for a different command. PowerShell also breaks the quote marks inside JSON typed straight into the command, so my POST and PUT tests read the JSON from small files. Create those files once, in the same folder as the code (run these in PowerShell, one at a time):

    Set-Content -Path body_post.json -Value '{"title":"Buy milk"}' -Encoding ascii
    Set-Content -Path body_put.json -Value '{"completed":true}' -Encoding ascii
    Set-Content -Path body_empty.json -Value '{}' -Encoding ascii
    Set-Content -Path body_user.json -Value '{"name":"Alice","email":"alice@example.com"}' -Encoding ascii
    Set-Content -Path body_user_put.json -Value '{"name":"Alice Updated"}' -Encoding ascii

Then, with the servers running, you can try for example:

    curl.exe -i http://localhost:3000/tasks
    curl.exe -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" --data "@body_post.json"
    curl.exe -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" --data "@body_put.json"
    curl.exe -i -X DELETE http://localhost:3000/tasks/1
    curl.exe -i http://localhost:3000/tassks

The first four should give 200, 201, 200 and 200, and the last one (a misspelt route) should give 404.

To see the 502 error, close the Task Service window and leave the gateway running, then run:

    curl.exe -i http://localhost:3000/tasks

You can also open http://localhost:3000/tasks and http://localhost:3000/users in a browser to look at the stored data. Press F5 after a test to see the change.


IF SOMETHING GOES WRONG

- Cannot find module 'express': you are in the wrong folder, or step 3 was skipped. Run npm install express in the folder that has the code.
- EADDRINUSE (port already in use): an old server is still running. Run taskkill /IM node.exe /F and start the servers again.
- fetch is not defined: your Node.js is older than version 18, so please update it.
- 502 Bad Gateway when everything should be running: one of the three servers has stopped. Check each window.


NOTES

The JSON files are fine for a project this size, but they have limits: every write rewrites the whole file, two requests at the same moment could overwrite each other, and there are no queries or indexes. The services also have no login or HTTPS. I talk about these points in the report.
