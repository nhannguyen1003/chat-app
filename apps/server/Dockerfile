# Dockerfile.backend

FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json từ gốc monorepo
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn từ monorepo
COPY . .

# Build ứng dụng backend (Nest.js)
RUN npx nx build server

# Expose port mà ứng dụng chạy
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "dist/apps/server/main.js"]
