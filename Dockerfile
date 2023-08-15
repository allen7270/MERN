# 使用 Node.js 的 LTS (長期支援) 版本作為基礎映像
FROM node:18

# 設定工作目錄，這是容器內的工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到容器內
COPY package*.json ./

# 安裝 Node.js 依賴
RUN npm install

# 複製專案所有檔案到容器內
COPY . .

# 暴露應用程式的端口，根據你的應用程式需求調整
EXPOSE 3000

# 啟動應用程式
CMD ["npm", "start"]