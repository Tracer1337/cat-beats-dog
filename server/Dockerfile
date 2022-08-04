FROM node:16-alpine

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

RUN npx prisma generate
RUN yarn build

ENV NODE_ENV=production
ENV PORT=8080

CMD ["yarn", "prod"]
