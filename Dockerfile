# Use an official Node runtime as the base image
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Set environment variables
ENV RAW_TRANSACTION="0x"
ENV PRIVATE_KEY="0x"
ENV RPC_URL="https://ethereum-holesky-rpc.publicnode.com"
ENV GAS_LIMIT=1000000
ENV MAX_FEE_PER_GAS_IN_GWEI=50
ENV MAX_PRIORITY_FEE_IN_GWEI=1
ENV VALUE_IN_ETHER=32

# Run the script when the Docker container launches
CMD ["node", "sign-and-broadcast-raw-tx.js"]
