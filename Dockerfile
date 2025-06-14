FROM node:22.14.0-alpine

RUN npm install -g pnpm

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

RUN pnpm run build

CMD ["pnpm", "run", "start"]
