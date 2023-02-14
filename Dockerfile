FROM node:16

# Create app directory
WORKDIR /app
RUN npm install -g nodemon

ADD package.json ./
RUN npm install

# Bundle app source
ADD bin ./bin

EXPOSE 3000
CMD [ "npm", "run", "dev"]