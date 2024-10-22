import csv from "csv-parser";
import fs from "fs"
import {DEV_HOST} from "../constants/urls.js";
import {DEV_TOKEN} from "../constants/tokens.js";
import {getWDTx, makeGetRequest} from "../helpers/getTxFromRequest.js";
import {delay} from "../helpers/delay.js";

async function getWDTxsList() {
  fs.writeFileSync('address-key-rawTx.csv', ''); // Очищаем файл перед записью

  const results = [];

  // Читаем CSV файл
  fs.createReadStream('addressAndPK.csv')
    .pipe(csv({separator: ';', headers: ['address', 'privateKey']}))
    .on('data', (row) => {
      results.push(row); // Собираем все строки
    })
    .on('end', async () => {
      console.log('CSV processing completed, starting requests.');

      // Обрабатываем каждую строку с паузой в 3 секунды
      for (const row of results) {
        let wallet = {
          address: row.address,
          privateKey: row.privateKey
        };

        let urlGetValidator = DEV_HOST + `/api/v1/eth/staking/ssv/p2p/validators?limit=50&offset=0&withdrawalAddress=${wallet.address}`;
        let validatorResponse = await makeGetRequest(urlGetValidator, DEV_TOKEN);
        let validator = validatorResponse.data.result.list[0].pubkey;

        let serializeTx = await getWDTx(validator, DEV_TOKEN)
        fs.appendFileSync('address-key-rawTx.csv', `${wallet.address};${wallet.privateKey};${serializeTx}\n`);

        console.log(`${new Date().toLocaleString()}: Saved tx for ${validator}`);

        await delay(1500);
      }

      console.log('All requests completed.');
    });
}

getWDTxsList()
