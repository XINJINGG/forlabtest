FROM node:20

WORKDIR /app

# Copy only package.json and package-lock.json first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies here
RUN npm install

# Then copy the rest of your app files
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
