FROM node:14

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

ENV DB_USERNAME=root
ENV DB_PASSWORD=1209
ENV DB_DATABASE=chainlinker
ENV SECRET_JWT=hyeonji

EXPOSE 3000

CMD ["npm", "run", "start"]
