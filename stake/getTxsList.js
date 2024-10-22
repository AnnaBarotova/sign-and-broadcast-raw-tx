import csv from "csv-parser";
import fs from "fs"
import {DEV_TOKEN} from "../constants/tokens.js";
import {getStakeTx} from "../helpers/getTxFromRequest.js";
import {delay} from "../helpers/delay.js";

// Асинхронная функция для обработки CSV с задержкой
async function getTxsList() {
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

        let serializeTx = await getStakeTx(wallet.address, DEV_TOKEN);
        fs.appendFileSync('address-key-rawTx.csv', `${wallet.address};${wallet.privateKey};${serializeTx}\n`);
        console.log(`${new Date().toLocaleString()}: Saved tx for ${wallet.address}`);

        await delay(1500);
      }

      console.log('All requests completed.');
    });
}

getTxsList();
