FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json .
RUN yarn install
COPY . .
RUN mv envwrapper /usr/local/bin/.
RUN chmod 755 /bin/envwrapper
ENV PG_HOST DOCKER_HOST
# EXPOSE 8080
CMD envwrapper yarn start -p 8080
