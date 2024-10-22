import {runSignAndBroadcast} from "../sign-and-broadcastFromCsv.js";

async function runWithdrawalSignAndBroadcast() {
  await runSignAndBroadcast(0)
}

await runWithdrawalSignAndBroadcast();
