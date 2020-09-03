FROM node:12.18.3-alpine3.10

WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
COPY . /app/
EXPOSE 3000
CMD ["npm", "start"]