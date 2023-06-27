# sign-and-broadcast-raw-tx

1. Build an image
```bash
docker build -t sign-and-broadcast-raw-tx .
```

2. Run it
```bash
docker run -e RAW_TRANSACTION="YOUR_RAW_TRANSACTION" -e PRIVATE_KEY="YOUR_PRIVATE_KEY" -it sign-and-broadcast-raw-tx
```

3. (Optional) Edit env variables in Dockerfile instead of passing them via a command line
```
ENV RAW_TRANSACTION="0x"
ENV PRIVATE_KEY="0x"
ENV RPC_URL="https://rpc.ankr.com/eth_goerli"
ENV GAS_LIMIT=1000000
ENV MAX_FEE_PER_GAS_IN_GWEI=50
ENV MAX_PRIORITY_FEE_IN_GWEI=1
ENV VALUE_IN_ETHER=32
```
Then do
```bash
docker build -t sign-and-broadcast-raw-tx .
```
```bash
docker run -it sign-and-broadcast-raw-tx
```
