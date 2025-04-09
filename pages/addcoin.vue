<template>
    <h1 align="center"">ADD COIN</h1>
    <div class="container">
      <form @submit.prevent="addCoin">
        <div>
          <label for="price">ราคา:</label>
          <select id="price" v-model="price">
            <option value="10">10 บาท</option>
            <option value="20">20 บาท</option>
            <option value="50">50 บาท</option>
            <option value="100">100 บาท</option>
            <option value="200">200 บาท</option>
            <option value="500">500 บาท</option>
          </select>
        </div>
  
        <div>
          <label for="amount">จำนวน:</label>
          <input type="number" id="amount" v-model="amount" min="1" />
        </div>
  
        <button :disabled="isSubmitting" type="submit">เพิ่มเหรียญ</button>
    </form>
    
      <button @click="$router.push('/')">HOMEPAGE</button>
      <!-- Success/Error Popup -->
      <div v-if="isPopupVisible" class="popup" :class="popupClass">
        <p>{{ popupMessage }}</p>
        <button @click="closePopup">ปิด</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const price = ref('10');
      const amount = ref(1);
      const isSubmitting = ref(false);
      const isPopupVisible = ref(false);
      const popupMessage = ref('');
      const popupClass = ref('');
  
      const addCoin = async () => {
        const data = {
          price: parseInt(price.value),
          amount: parseInt(amount.value),
        };
  
        isSubmitting.value = true;
        popupMessage.value = '';
        popupClass.value = '';
        isPopupVisible.value = false;
  
        try {
          const response = await fetch('/api/addcoin', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
  
          if (response.ok) {
            const responseData = await response.json();
            console.log('Coin added successfully:', responseData);
            popupMessage.value = 'เพิ่มเหรียญสำเร็จ!';
            popupClass.value = 'success';
          } else {
            console.error('Failed to add coin:', response.status);
            popupMessage.value = `การเพิ่มเหรียญล้มเหลว! รหัสสถานะ: ${response.status}`;
            popupClass.value = 'error';
          }
        } catch (error) {
          console.error('There was an error sending the request:', error);
          popupMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ!';
          popupClass.value = 'error';
        } finally {
          isSubmitting.value = false;
          isPopupVisible.value = true;
        }
      };
  
      const closePopup = () => {
        isPopupVisible.value = false;
      };
  
      return {
        price,
        amount,
        addCoin,
        isSubmitting,
        isPopupVisible,
        popupMessage,
        popupClass,
        closePopup,
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 25px;
  background: linear-gradient(135deg, #eef2f3, #8e9eab);
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

label {
  font-weight: bold;
  color: #333;
}

select, input[type="number"] {
  padding: 10px;
  border-radius: 5px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

button {
  padding: 12px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.popup {
  backdrop-filter: blur(10px);
  border: 2px solid #fff;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup.success { border: 2px solid #28a745; color: #28a745; }
.popup.error { border: 2px solid #dc3545; color: #dc3545; }

  </style>
  