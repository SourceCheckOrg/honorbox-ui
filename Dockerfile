FROM node:alpine

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies
RUN npm install

# build app
RUN npm run build

# expose port 3000
EXPOSE 3000

# start app
CMD npm run start
