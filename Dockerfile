# Use Node.js version 14 as the base image
FROM node:16.16.0-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install Yarn globally
#RUN npm install yarn --location=global

# Install the dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Install Prisma globally (if necessary, you can use yarn global add prisma)
RUN yarn global add prisma

# Generate the Prisma client
#RUN yarn prisma:generate:nex-library
#RUN yarn prisma:generate:nex-learning
#RUN yarn prisma:generate:nex-community
#RUN yarn prisma:generate:nex-level
#RUN yarn prisma:generate:homepage
#RUN yarn prisma:generate:nex-talk

RUN yarn migrasi:semua-data
#RUN yarn migrasi:semua

# Expose port 3000 for the application to listen on
EXPOSE 3000

# Set the command to start the application
CMD ["yarn", "start"]
