FROM node:18-alpine

RUN mkdir /app
WORKDIR /app

RUN corepack enable

COPY .yarn/ /app/.yarn/
COPY package.json yarn.lock  /app/

RUN yarn install

COPY . /app

RUN yarn build

ENTRYPOINT ["yarn", "run"]

CMD ["start"]