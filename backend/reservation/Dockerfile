FROM node:14-alpine

WORKDIR /backend/
COPY package.json /backend/
RUN npm install --production
COPY . /backend

EXPOSE 3000

RUN npm run build

CMD ["node","dist/app.js"]
