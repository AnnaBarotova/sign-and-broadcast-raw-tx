require('dotenv').config();
const ethers = require('ethers');

async function signAndBroadcast() {
    console.log("Started")

    const rawTransaction = process.env.RAW_TRANSACTION;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcURL = process.env.RPC_URL;

    // Initialize the provider using the RPC URL
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);

    // Initialize a new Wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    // Parse the raw transaction
    const tx = ethers.utils.parseTransaction(rawTransaction);

    const {name, chainId} = await provider.getNetwork()
    tx.nonce = await provider.getTransactionCount(wallet.address)
    tx.chainId = chainId
    tx.value = ethers.utils.parseUnits(process.env.VALUE_IN_ETHER, 'ether')
    tx.gasLimit = process.env.GAS_LIMIT
    tx.gasPrice = undefined
    tx.type = 2
    // tx.maxFeePerGas = ethers.utils.parseUnits(process.env.MAX_FEE_PER_GAS_IN_GWEI, 'gwei')
    // tx.maxPriorityFeePerGas = ethers.utils.parseUnits(process.env.MAX_PRIORITY_FEE_IN_GWEI, 'gwei')

    // Sign the transaction
    const signedTransaction = await wallet.signTransaction(tx);

    // Send the signed transaction
    const transactionResponse = await provider.sendTransaction(signedTransaction);

    return transactionResponse;
}

signAndBroadcast()
    .then((transactionResponse) => {
        console.log('Transaction broadcasted, transaction hash:', transactionResponse.hash);
    })
    .catch((error) => {
        console.error('Error:', error);
    }).finally(() => {
        console.log('Finished')
    });
