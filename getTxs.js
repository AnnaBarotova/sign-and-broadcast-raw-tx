import axios from 'axios';
import csv from "csv-parser";
import fs from "fs"

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// Функция для выполнения GET запроса
async function makeGetRequest(url, token) {
  const config = {
    headers: { 'Authorization': `Bearer ${token}` }
  };
  return axios.get(url, config);
}

// Асинхронная функция для обработки CSV с задержкой
async function getTxs() {
  fs.writeFileSync('address-key-rawTx.csv', ''); // Очищаем файл перед записью

  const results = [];

  // Читаем CSV файл
  fs.createReadStream('addressAndPK.csv')
    .pipe(csv({ separator: ';', headers: ['address', 'privateKey'] }))
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

        let url = "https://eth2-staking-api-backend.dev-p2p.org/api/v1/eth/staking/ssv/p2p/deposit" +
          `?amount=32&withdrawalAddress=${wallet.address}`;

        try {
          // Выполняем запрос для каждого кошелька
          let response = await makeGetRequest(url, "hb4O3EvexNgIFRE6v0c63e0vlc5irpmh");
          let serializeTx = response.data.result.serializeTx;

          // Записываем результат в новый CSV файл
          fs.appendFileSync('address-key-rawTx.csv', `${wallet.address};${wallet.privateKey};${serializeTx}\n`);
          console.log(`${new Date().toLocaleString()}: Saved tx for ${wallet.address}`);
        } catch (error) {
          console.error(`Error processing wallet ${wallet.address}:`, error);
        }

        // Пауза на 3 секунды перед следующим запросом
        await delay(1500);
      }

      console.log('All requests completed.');
    });
}

getTxs();
