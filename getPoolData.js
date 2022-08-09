import { ethers } from "ethers";
import { xBOOAPR, booPriceUSD } from "./xBooAPRv2.js";
import { AcelabV3Abi, AcelabV3Adress } from "./contracts/AceLabV3.js";
import { xBOO_Address, xBOO_ABI } from "./contracts/xBOO.js";
import { fetchFTM_PriceUSD, fetchTokenPrice_FTM } from "./tokenPriceData.js";

//DECLARE RPC_PROVIDER
const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/fantom/",
    { name: "fantom", chainId: 250 }
);

//MOUNT CONTRACTS
const AceLabV3 = new ethers.Contract(AcelabV3Adress, AcelabV3Abi, provider);
const xBOO = new ethers.Contract(xBOO_Address, xBOO_ABI, provider);

export async function getPoolAPR(poolID) {

    // FETCH POOL DATA 
    const poolInfo = await AceLabV3.poolInfo(poolID);
    //console.log(poolInfo);

    //POOL DATA VARIABLES
    const RewardToken = poolInfo[0];
    const TokenPrecision = poolInfo[2]
    const xBooStakedAmount = poolInfo[3]
    const xBOOinPool = Number(BigInt(xBooStakedAmount.toString()) / 1000000000000000000n)
    const mpStakedAmount = poolInfo[4].toString() * 1
    const RewardPerYear = Number((BigInt(poolInfo[5].toString()) * 31536000n)) / (1 * 10 ** TokenPrecision)

    //FETCH XBOO/BOO RATIO
    const xBOO_BOO_ratio = (await xBOO.xBOOForBOO(1000000000000000000n)) / 1000000000000000000;

    //FETCH PRICE DATA 
    const FTM_Data = await fetchFTM_PriceUSD();
    const FTM_Price = FTM_Data.data.bundles[0].ethPrice;
    const token_Data = await fetchTokenPrice_FTM(RewardToken)

    //Calculate Prices in USD
    const token_Price = token_Data.data.tokens[0].derivedETH
    const xBooPriceUSD = xBOO_BOO_ratio * booPriceUSD
    //   //console.log(xBooPriceUSD);
    const tokenPriceUSD = token_Price * FTM_Price
    //console.log(tokenPriceUSD + " TOKEN PRICE USD");

    // //XBOO TVL IN POOL
    const TVLinPool = xBooPriceUSD * xBOOinPool;
    // console.log(TVLinPool)

    // XBOO POOL REWARD PER YEAR
    const TokenRewardperYear = 0.91 * tokenPriceUSD * RewardPerYear;
    // console.log(TokenRewardperYear)

    // //POOL APR
    const PoolApr = (TokenRewardperYear / TVLinPool) * 100;
    //console.log(PoolApr + " POOL APR");

    // //POOL APR+XBOO
    const PoolAprPlusXBOO = PoolApr + xBOOAPR;
    console.log(PoolAprPlusXBOO + " POOL APR+XBOO");

    // MC POOL REWARD PER YEAR
    const TokenRewardperYearMC = 0.09 * tokenPriceUSD * RewardPerYear;
    const TVLinMCPool = (mpStakedAmount / 140) * xBooPriceUSD;
    const MCPoolApr = (TokenRewardperYearMC / TVLinMCPool) * 100000
    console.log(MCPoolApr + " MC POOL APR");

    return (
        {
            MCPoolApr, PoolApr, PoolAprPlusXBOO
        }
    )



    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // //  CATTOKEN
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // // const nxBoo = 230.0703;
    // // const _mp = 2100;
    // // const limit = uint(nxBoo) * 140 / 1e18;
    // // const effectiveMP = uint(_mp) < limit
    // //     ? _mp
    // //     : limit;




    // // const magicatReward =
    // //     (effectiveMP * accRewardPerShareMagicat) / precisionOf;

    // // const totalReward = (xbooReward + magicatReward);


}