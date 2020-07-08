FROM node:10.15.3
RUN mkdir -p /usr/src/app/service
WORKDIR /usr/src/app/service
COPY service /usr/src/app/service
RUN npm install
EXPOSE 3001
CMD npm start