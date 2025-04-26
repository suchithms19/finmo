# Use the official Node.js image as the base image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]