FROM node:18-alpine
COPY . .
RUN apk add --no-cache build-base tzdata python3 sqlite-dev sqlite git postgresql postgresql-dev

ENV NODE_ENV ${NODE_ENV}
#RUN npm i -g npm@8.12.2 pm2
RUN npm cache verify && npm cache clean --force
#RUN npm install swagger-themes --save
#RUN npm install paytabs_pt2 
RUN npm i && npm run build

EXPOSE 3000
CMD ["node","dist/main.js"]
