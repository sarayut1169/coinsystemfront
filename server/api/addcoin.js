export default defineEventHandler(async (event) => {
    const method = event.req.method;

    if (method === 'PUT') {
        const requestBody = await readBody(event);  // อ่านข้อมูลจาก body (หากจำเป็น)

        // สมมุติว่า requestBody มีข้อมูล เช่น price, amount
        const { price, amount } = requestBody;  // ดึงค่าจาก requestBody

        // สร้าง URL พร้อม query parameters
        const url = `http://localhost:5062/api/Money/addcoin?price=${price}&amount=${amount}`;

        // ส่งคำขอ PUT
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                // คุณสามารถเพิ่ม headers อื่น ๆ ได้ถ้าต้องการ
            }
        });

        // เช็คผลการตอบกลับจาก API
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        return await response.json();
    }
});
