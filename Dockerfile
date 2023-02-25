FROM node:18-alpine

RUN mkdir /app
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarn/ /app/

RUN yarn install

COPY . /app

RUN yarn build

ENTRYPOINT ["yarn", "run"]

CMD ["start"]