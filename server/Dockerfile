FROM node:21-alpine
RUN apk add --no-cache curl
RUN mkdir -p /usr/src/app/server
WORKDIR /usr/src/app/server
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3333
