#node image default lts
FROM node:22.20.0-bullseye


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start:dev" ]