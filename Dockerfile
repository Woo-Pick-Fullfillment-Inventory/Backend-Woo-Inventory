FROM node:18 AS ts-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig-build.json ./
COPY src/ src/
RUN npm run build

FROM node:18 AS prod-dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine3.16
WORKDIR /app
COPY --from=ts-builder /app/dist ./dist/
COPY --from=prod-dependencies /app/node_modules /node_modules
COPY package.json ./

ENV FIRESTORE_EMULATOR_HOST="firestore:8888"

USER 1000

CMD ["node","./dist/app.js"]