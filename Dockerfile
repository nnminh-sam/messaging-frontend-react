# Use the official Node.js image as the base image
FROM node:20

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with a clean slate
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]