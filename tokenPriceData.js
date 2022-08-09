//Create Fura Headers
import { furaHeaders } from "./furaHeaders.js";
///////////////////////////////////

//Create Fura Body
export async function fetchTokenPrice_FTM(tokenID) {

    const id = (id) => JSON.stringify({
        "operationName": "tokens",
        "query": `fragment TokenFields on Token {\n  id\n  name\n  symbol\n  derivedETH\n  }\n\n query tokens {\n  tokens(where: {id: \"${id}\" }) {\n    ...TokenFields\n    }\n}\n`
    });

    const raw = id(tokenID)


    var requestOptions = {
        method: 'POST',
        headers: furaHeaders,
        body: raw,
        redirect: 'follow'
    };

    const tokenCall = await fetch("https://api.fura.org/subgraphs/name/spookyswap", requestOptions)
        .then(response => response.text())
        .then(res => {
            //console.log(res)
            return JSON.parse(res);
        })
        .catch(error => console.log('error', error));

    ///////////////////////////////////////////////////////////
    return tokenCall;

}

export async function fetchFTM_PriceUSD() {

    const raw = JSON.stringify({ "operationName": "bundles", "variables": {}, "query": "query bundles {\n  bundles(where: {id: 1}) {\n    id\n    ethPrice\n    __typename\n  }\n}\n" });
    const requestOptions = {
        method: 'POST',
        headers: furaHeaders,
        body: raw,
        redirect: 'follow'
    };
    const tokenCall = await fetch("https://api.fura.org/subgraphs/name/spookyswap", requestOptions)
        .then(response => response.text())
        .then(res => {
            //console.log(res)
            return JSON.parse(res);
        })
        .catch(error => console.log('error', error));

    return tokenCall;


}