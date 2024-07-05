FROM node:20-alpine3.19

WORKDIR /  

COPY package*.json .

RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run","start" ]