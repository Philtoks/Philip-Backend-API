# Use an official Node.js image 
FROM node:14

# Set the working directory in the container 
WORKDIR /app

# copy the package.json to the container directory 
COPY package.json ./

# install the dependencies 
RUN npm install 

# copy the rest of the files to the container
COPY . .

# expose port 5000 on the container 
EXPOSE 3000

CMD ["node", "app.js"]