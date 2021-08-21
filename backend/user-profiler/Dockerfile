FROM node:14-alpine

WORKDIR /user-profiler/
COPY package.json /user-profiler/
RUN npm install --production
COPY . /user-profiler

EXPOSE 3000

RUN npm run build

CMD ["node","dist/app.js"]
