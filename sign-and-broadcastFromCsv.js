import csv from "csv-parser";
import fs from "fs"
import {signAndBroadcast} from "./sign-and-broadcast-raw-tx.js";

async function runSignAndBroadcast(){
  fs.writeFileSync('tx-list.csv', ''); // Очищаем файл перед записью

  let envvars = {
    rawTx: '',
    privateKey: '',
    rpcUrl: "https://ethereum-holesky-rpc.publicnode.com",
    valueInEther: "32",
    gasLimit: "1000000",
    maxFeePerGasInGwei: "50",
    maxPriorFeeInGwei: "1"
  }
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const results = [];


  // Читаем CSV файл
  fs.createReadStream('address-key-rawTx.csv')
    .pipe(csv({ separator: ';', headers: ['address', 'privateKey', 'rawTx'] }))
    .on('data', (row) => {
      results.push(row); // Собираем все строки
    })
    .on('end', async () => {
      console.log('CSV processing completed, starting to sign');
      for (const row of results) {
        let accountData = {
          address: row.address,
          privateKey: row.privateKey,
          rawTx: row.rawTx
        };
        envvars.privateKey=accountData.privateKey;
        envvars.rawTx=accountData.rawTx;

        fs.appendFileSync('tx-list.csv', `${accountData.address};`);

        await signAndBroadcast(envvars)
        //delay 100 ms causes a ~5 txs to pass into 1 block
        await delay(100);
      }
      console.log('All requests completed.');
    });
}
runSignAndBroadcast();
