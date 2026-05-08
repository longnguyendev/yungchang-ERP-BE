FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files trước để tận dụng layer cache
COPY . .

# Cài toàn bộ dependencies (bao gồm devDependencies)
RUN npm install


# Chạy ở chế độ development với hot-reload
CMD ["npm", "run", "start:dev"]