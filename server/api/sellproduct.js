export default defineEventHandler(async (event) => {
    
    if (event.req.method === 'GET') {
        const url = 'http://localhost:5062/api/Product/all';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'accept': '*/*'
            }
        });
        return await response.json();
    }
    if (event.req.method === 'PUT') {
        console.log(await readBody(event));
        const { productid,tellNumber } = getQuery(event);
        console.log(tellNumber); // Logs the tellNumber
        console.log(productid);
        const url = `http://localhost:5062/api/Sell/sell?producid=${productid}&tell=${tellNumber}`;
        console.log("eiei");
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'content-type': 'application/json'
            },
            body: JSON.stringify(await readBody(event))
        });
        return await response.json();
    }
    

});
