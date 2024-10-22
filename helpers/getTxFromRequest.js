import axios from 'axios';
import {DEV_HOST} from "../constants/urls.js";


export async function makeGetRequest(url, token) {
  try {
    const config = {
      headers: {'Authorization': `Bearer ${token}`}
    };
    return axios.get(url, config);
  } catch (error) {
    console.error(`Request ${url} failed`)
  }
}

async function makePostRequestNoBody(url, token) {
  const config = {
    headers: {'Authorization': `Bearer ${token}`}
  };
  return axios.post(url, "", config);
}

export async function getStakeTx(address, token) {
  try {
    let url = DEV_HOST + `/api/v1/eth/staking/ssv/p2p/deposit?amount=32&withdrawalAddress=${address}`
    let response = await makeGetRequest(url, token)

    return response.data.result.serializeTx;
  } catch (error) {
    console.error(`Error processing wallet ${address}:`, error);
  }
}

//there tx is made only for 1 validator
export async function getWDTx(validator, token) {
  try {
    let url = DEV_HOST + `/api/v1/eth/staking/ssv/p2p/withdraw?pubkeys[]=${validator}`
    let response = await makePostRequestNoBody(url, token);

    return response.data.result.list[0].serializeTx;
  } catch (error) {
    console.error(`Error processing validator ${validator}:`, error);
  }
}


