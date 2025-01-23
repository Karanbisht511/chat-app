# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Use an Nginx image to serve the React app
FROM nginx:alpine

# Copy the build output to Nginx's default public directory
COPY --from=0 /usr/dist /usr/share/nginx/html

# Expose port 80
# EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
