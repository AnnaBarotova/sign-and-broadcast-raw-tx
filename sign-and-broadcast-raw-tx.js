import {ethers} from "ethers";
import fs from "fs";

 export async function signAndBroadcast(injectedEnvvars) {
    console.log("Started");

    let envvars = injectedEnvvars || {
        rawTx: process.env.RAW_TRANSACTION,
        privateKey: process.env.PRIVATE_KEY,
        rpcUrl: process.env.RPC_URL,
        valueInEther: process.env.VALUE_IN_ETHER,
        gasLimit: process.env.GAS_LIMIT,
        maxFeePerGasInGwei: process.env.MAX_FEE_PER_GAS_IN_GWEI,
        maxPriorFeeInGwei: process.env.MAX_PRIORITY_FEE_IN_GWEI
    }

    const rawTransaction = envvars.rawTx;
    const privateKey = envvars.privateKey;
    const rpcURL = envvars.rpcUrl;

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
        value: ethers.parseUnits(envvars.valueInEther, 'ether'),
        gasLimit: BigInt(envvars.gasLimit),
        type: 2,

        nonce: await provider.getTransactionCount(wallet.address),
        maxFeePerGas: ethers.parseUnits(envvars.maxFeePerGasInGwei, 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits(envvars.maxPriorFeeInGwei, 'gwei')
    }

    // Sign the transaction
    const signedTransaction = await wallet.signTransaction(newTx);

    // Send the signed transaction
    try {
        const transactionResponse = await provider.broadcastTransaction(signedTransaction)
        console.log('Transaction broadcasted, transaction hash:', transactionResponse.hash);
      fs.appendFileSync('tx-list.csv', `${transactionResponse.hash}\n`);
    } catch (error) {console.error('Error:', error);}
    finally {
        console.log('Finished');
    }
}
