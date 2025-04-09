export default defineEventHandler(async (event) => {
    const method = event.req.method;

    if (method === 'GET') {
        // Handle GET request logic here if needed
    } 
    else if (method === 'PUT') {
        const { price, amount } = getQuery(event);

        if (!price || !amount) {
            throw new Error('Missing required query parameters: price or amount');
        }

        const url = `http://localhost:5062/api/Money/addcoin?price=${price}&amount=${amount}`;
        const requestBody = await readBody(event);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'content-type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        return await response.json();
    }
});
// 'http://localhost:5062/api/Money/addcoin?price=50&amount=52