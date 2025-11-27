FROM node:22.18.0

LABEL authors="robighetti"

WORKDIR /app

COPY package*.json ./

COPY . . 

RUN npm cache clean --force

RUN npm install --force

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
