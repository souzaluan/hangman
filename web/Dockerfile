FROM node:21-alpine
RUN mkdir -p /usr/src/app/web
WORKDIR /usr/src/app/web
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5173
