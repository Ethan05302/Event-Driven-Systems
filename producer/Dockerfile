FROM node:18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY index.js ./
CMD ["node", "index.js"] 