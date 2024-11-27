This is a simple Node JS backend app that employs the invocation of CRUD operation for the API. The purpose of this exercise is the learn how to dockerise an application and progressively incorporate essential devops tools.

Creating a Dockerized Node.js App and Deploying it on AWS EC2 server 

Prerequisites:

AWS EC2 instance with docker installed on it 
A Node.js application with a package.json, app.js, controllers and routes files. These should be placed in the directory of your choice on the EC2 server.
I have chosen /Philip-Backend-API for this exercise 

Basic knowledge of Docker and Node.js.
Objectives:

Dockerize a Node.js app.
Deploy the Docker container on an EC2 instance.
Expose the Node.js app on a specific port.
Test the deployed app using a curl command or local browser.

Task Scenario:

There is a requirement to Dockerize a Node app and to deploy the same on an EC2 instance. In our text editor (Vscode), we already have the app.js, package.json file, etc 

Create a Dockerfile (name is case sensitive) in that folder in Vscode :

Use any node image as the base image.

Install the dependencies using package.json file.

Use app.js in the CMD.

Expose port 3000.

The build image should be a name of your choice.

Now run a container named of your choice using this image.

Map the container port 3000 with the host port 8091.

. Once deployed, you can test the app using a curl command on EC2 instance or Public_IP_of_EC2:8091:

curl http://localhost:8091

Step-by-Step Guide:

Step 1: Create a Dockerfile 

Step 2: From your Vscode, click on the search bar and select "Show and run commands" or SHIFT + Command + P (Mac users)
        Then search up "Publish to Github". This will move your folder to github and create a repo instead of creating in github and then cloning in your local machine
        
Step 2: Create EC2 instance from AWS, expose port 8091 and SSH into the machine. 
        Switch to root user "sudo -i" and install docker in your EC2 machine (follow steps from docker documentation)
        Also check if git is installed in the EC2 instance "git --version"
        run "git clone github_repo_URL" to clone your gihub repo

Step 3: Build your image using "docker build -t IMAGE_NAME ." 
        (need to switch to root user to run docker commands without "sudo")

Step 4: Run your image in a docker container "docker run -d -p HOST_PORT:CONTAINER_PORT --name CONTAINER_NAME IMAGE_NAME"
        (n/b: If your app.js is listening on 5000, you need to expose your docker container on port 5000)

Step 5: Test your application on the browser Public_IP_of_EC2:HOST_PORT 
        (If your container is not running, it means the command in your Dockerfile is not executing due to errors)
        (run "docker logs CONTAINER_NAME" to check the logs of the container and solve your issue)

HOW TO SET UP AWS ECR AND PUSH DOCKER IMAGES TO THE REGISTRY

Prerequisite: 
        - AWS CLI: Since we will be running shell scripts in Jenkins pipleine, we need to login to AWS via CLI. SO install AWS CLI
        - IAM USer: Logging into the AWS CLI works by creating an IAM user first, and then passing that user’s credentials in the terminal.