FROM node:22-alpine
WORKDIR /app
RUN npm install -g @ionic/cli
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 8100
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "8100", "--disable-host-check"]
