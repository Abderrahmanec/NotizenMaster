FROM node:14-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force



# Copy all project files
COPY . .



# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm","start"]