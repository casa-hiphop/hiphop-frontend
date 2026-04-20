FROM node:22.18.0

LABEL authors="robighetti"

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG PORT=3000

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV PORT=$PORT

COPY package*.json ./

COPY . . 

RUN npm cache clean --force

RUN npm install --force

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
