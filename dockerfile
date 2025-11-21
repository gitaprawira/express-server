# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
# Using 'npm ci' is recommended for consistent installs
RUN npm ci

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# The command to run your app with nodemon (from your package.json)
CMD [ "npm", "run", "dev" ]