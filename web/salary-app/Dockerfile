FROM node:16-alpine as build

ENV NODE_ENV=production

RUN mkdir -p /service

COPY . /service

RUN cd /service && npm ci && npm run build

FROM node:16-alpine

COPY --from=build /service/build /service
RUN npm install --global serve
WORKDIR /service

CMD ["serve"]