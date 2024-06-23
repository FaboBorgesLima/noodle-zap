FROM node:22-alpine3.20

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 8080

CMD [ "npm", "run", "dev" ]