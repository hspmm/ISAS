FROM node:10.15.3
RUN mkdir -p /usr/src/app/ui
WORKDIR /usr/src/app/ui
COPY ui /usr/src/app/ui
RUN npm install
EXPOSE 4201
CMD npm start
