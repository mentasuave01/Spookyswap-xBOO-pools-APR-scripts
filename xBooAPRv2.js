import { ethers } from "ethers";
import { BOOAbi, BOOAddress } from "./BOO.js";
import { BooUsdLP_ABI, BooUsdLP_Address } from "./BooUsdLP.js";

//DECLARE RPC_PROVIDER
const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/fantom/",
    { name: "fantom", chainId: 250 }
);
//Mount Contract
const BOO = new ethers.Contract(BOOAddress, BOOAbi, provider);
const BooUsdLP = new ethers.Contract(BooUsdLP_Address, BooUsdLP_ABI, provider);


//Create Fura Headers
import { furaHeaders } from "./furaHeaders.js";
///////////////////////////////////

//Calculate start date unix timestamp to fetch a full week
const day = 24 * 60 * 60;
const now = Date.now() / 1000
const startOfDay = (now - now % day) - (day * 7 + 1);
//console.log(startOfDay);
///////////////////////////////////////////////////////////

//Create Fura Body
var raw = JSON.stringify({
    "operationName": "uniswapDayDatas",
    "variables": { "startTime": startOfDay },
    "query": "query uniswapDayDatas($startTime: Int!) {\n  uniswapDayDatas(first: 8, where: {date_gt: $startTime}, orderBy: date, orderDirection: asc) {\n    id\n    date\n       dailyVolumeUSD\n        }\n}\n"
});
///////////////////////////////////////////////////////////

//fetch DailyVolume in USD

var requestOptions = {
    method: 'POST',
    headers: furaHeaders,
    body: raw,
    redirect: 'follow'
};
const dailyVol = await fetch("https://api.fura.org/subgraphs/name/spookyswap", requestOptions)
    .then(response => response.text())
    .then(res => {
        //console.log(res)
        return JSON.parse(res);
    })
    .catch(error => console.log('error', error));
///////////////////////////////////////////////////////////

//fetch BOO balance on xBOO contract and multiply by USD price to get TVL
const xBooAddress = "0xa48d959AE2E88f1dAA7D5F611E01908106dE7598"
const getBalance = await BOO.balanceOf(xBooAddress);
const booBalance = getBalance.toString() / 1e18;
const getBOOPrice = await BooUsdLP.getReserves();
const booPriceUSD = (getBOOPrice[0].toString() / 1e6) / (getBOOPrice[1].toString() / 1e18);
const xBooTVL_USD = (booPriceUSD * booBalance);
//console.log(xBooTVL_USD);


//Calculate weekly fees////////////////////////////////
let weeklyBBs = 0;
for (let i = 0; i <= 6; i++) { //iterate 7 days
    const daylyBBs = dailyVol.data?.uniswapDayDatas[i].dailyVolumeUSD * (0.0003 * 0.85);
    weeklyBBs = weeklyBBs + daylyBBs
}
//average the sum
weeklyBBs = weeklyBBs / 7

////////////////////////////////////////////////////////

//APR CALCULATION
const xBOOAPR = (100 * weeklyBBs * 365) / xBooTVL_USD;
console.log(xBOOAPR.toFixed(2) + " XBOO_APR");
export { xBOOAPR, xBooTVL_USD, booPriceUSD }




