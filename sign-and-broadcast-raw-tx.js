require('dotenv').config();
const { ethers } = require('ethers');

async function signAndBroadcast() {
    console.log("Started");

    const rawTransaction = process.env.RAW_TRANSACTION;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcURL = process.env.RPC_URL;

    // Initialize the provider using the RPC URL
    const provider = new ethers.JsonRpcProvider(rpcURL);

    // Initialize a new Wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);

    // Parse the raw transaction
    let tx = ethers.Transaction.from(rawTransaction);

    // Fetch network details and update the transaction object
    const { chainId } = await provider.getNetwork();

    const newTx = {
        to: tx.to,
        data: tx.data,
        chainId: chainId,
        value: ethers.parseUnits(process.env.VALUE_IN_ETHER, 'ether'),
        gasLimit: BigInt(process.env.GAS_LIMIT),
        type: 2,

        nonce: await provider.getTransactionCount(wallet.address),
        maxFeePerGas: ethers.parseUnits(process.env.MAX_FEE_PER_GAS_IN_GWEI, 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits(process.env.MAX_PRIORITY_FEE_IN_GWEI, 'gwei')
    }

    // Sign the transaction
    const signedTransaction = await wallet.signTransaction(newTx);

    // Send the signed transaction
    const transactionResponse = await provider.broadcastTransaction(signedTransaction);

    return transactionResponse;
}

signAndBroadcast()
    .then((transactionResponse) => {
        console.log('Transaction broadcasted, transaction hash:', transactionResponse.hash);
    })
    .catch((error) => {
        console.error('Error:', error);
    }).finally(() => {
    console.log('Finished');
});
