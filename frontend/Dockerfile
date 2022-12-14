# useful: https://mherman.org/blog/dockerizing-a-react-app/

# pull official base image
FROM node:12.22.10-alpine

# set working directory
WORKDIR /uas/gcomx/frontend

# copy gcom files
COPY . ./

# add npm-installed binaries to $PATH
RUN npm install --legacy-peer-deps -g webpack webpack-cli
ENV PATH /uas/gcomx/frontend/node_modules/.bin:$PATH

# generate a stats file to satisfy backend dependency
RUN webpack --json > /uas/gcomx/frontend/webpack-stats.json

EXPOSE 8080

# for backend bundle
RUN npm run build

# for production
# CMD ["npm", "run", "production"]

# for hot-reloadable dev
CMD ["npm", "start"]
