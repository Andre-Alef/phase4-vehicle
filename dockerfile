# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY ./package*.json ./

# Install dependencies (including dev dependencies like NestJS CLI)
RUN npm install

# Copy the rest of the application code
COPY ./ /usr/src/app

# Generate Prisma Client (make sure prisma is part of your dependencies)
RUN npx prisma generate

# Build the NestJS application (this will use the NestJS CLI)
#RUN npm run build

# Expose the port that the user service will run on
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "prod"]
