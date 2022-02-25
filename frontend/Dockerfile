# useful: https://mherman.org/blog/dockerizing-a-react-app/

# pull official base image
FROM node:12.22.10-alpine

# set working directory
WORKDIR /gcom

# COPY package.json ./
COPY . ./

RUN npm install --legacy-peer-deps
# RUN npm install --save-dev html-webpack-plugin

# add `/gcom/node_modules/.bin` to $PATH
ENV PATH /gcom/node_modules/.bin:$PATH
# RUN npm install --save-dev webpack-cli --legacy-peer-deps

# add gcom
# COPY . ./

RUN npm run build

# RUN npm install -g react-scripts@3.4.1
# RUN npm install -g typescript

# start gcom in dev mode
CMD ["npm", "start"]

# start gcom in prod mode
# CMD ["npm", "run", "prod"]