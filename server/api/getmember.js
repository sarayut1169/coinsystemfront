export default defineEventHandler(async (event) => {
    if (event.req.method === 'POST') {


        // Wait for the body to be read once
        const body = await readBody(event);
        console.log(body); // Logs the whole body
                
        const { tellNumber } = body; // Destructure the tellNumber from the body
        console.log(tellNumber); // Logs the tellNumber



        const url = `http://localhost:5062/api/Sell/getMember/${tellNumber}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'accept': '*/*'
            }
        });
        return await response.json();
    }
});
