FROM node:21-bullseye-slim
RUN apt-get update && \
    apt-get install -y make && \
    apt-get install -y procps && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 3000
COPY package.json .
RUN yarn
COPY . .
