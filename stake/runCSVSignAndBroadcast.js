import {runSignAndBroadcast} from "../sign-and-broadcastFromCsv.js";

async function runStakeSignAndBroadcast() {
  await runSignAndBroadcast(32);
}

await runStakeSignAndBroadcast()
