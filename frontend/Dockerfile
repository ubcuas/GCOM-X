# UBC UAS Dockerfile - Frontend

# Pull the base node image
FROM node:8-alpine

RUN apk add --no-cache git

# Create app directory
RUN mkdir -p /uas/gcomx/frontend
WORKDIR /uas/gcomx/frontend

# Install app dependencies
COPY package*.json ./

# Install NODE dependencies
RUN npm install
RUN npm rebuild node-sass

# Add other conf files
COPY *.js *.json .babelrc .bootstraprc ./

# Expose the correct port
EXPOSE 3000