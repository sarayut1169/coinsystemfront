<template>
  <div class="container">
    <h1>PLEASE SELECT PRODUCT</h1>
    <div class="product-grid" :style="gridStyles">
      <div
        v-for="(product, index) in products"
        :key="product.id"
        class="product-item"
      >
        <img :src="product.picture" :alt="product.name" class="product-image">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>PRICE: {{ product.price }} BATH</p>
            <p :style="{ color: product.amount === 0 ? 'red' : 'inherit' }">
            {{ product.amount === 0 ? 'OUT OF STOCK' : `AMOUNT: ${product.amount}` }}
            </p>
          <button @click="openPopup(product)">Select</button>
        </div>
      </div>
      <div v-if="error" class="error-message">
        DATA ERROR: {{ error.message }}
      </div>
      <div v-if="products.length === 0 && !error" class="loading-message">
        LOADING PRODUCT...
      </div>
    </div>

    <!-- Popup Modal -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <img :src="selectedProduct.picture" :alt="selectedProduct.name" class="popup-image">
        <h3>{{ selectedProduct.name }}</h3>
        <p>PRICE: {{ selectedProduct.price }} BATH</p>

        <div>
          <form @submit.prevent="addTellNumber"> 
          <div>
            <p>PLEASE INSERT TELL NUMBER</p>
            <input 
              type="text" 
              v-model="tellNumber" 
              placeholder="TELL NUMBER" 
              class="tell-input" 
              required
            >
          </div>
          <button type="submit">Submit Tell Number</button> 
        </form>
        </div>
        <div>
        <p v-if="tellRes"> Credit: {{ Number(tellRes.credit) }}</p>

        <div v-if="tellRes && selectedProduct">
          <h5>PLEASE INSERT MONEY = {{ Math.max(0, Number(selectedProduct.price) - Number(tellRes.credit)) }}</h5>
        </div>


        </div>


        <div class="money-input">
          <label v-for="denomination in denominations" :key="denomination">
            <div class="money-control">
              <button @click="changeMoney(denomination, -1)" class="money-btn" style="background-color: red;">-</button>
              <input 
                type="number" 
                v-model="money[denomination]" 
                :placeholder="denomination + ' BATH'" 
                min="0" 
                class="money-input-field"
              >
              <button @click="changeMoney(denomination, 1)" class="money-btn">+</button>
            </div>
            {{ denomination }} BATH
          </label>
        </div>

        <button @click="payProduct" :disabled="!tellRes">Pay Product</button>
        <br>
        <br>
        <button @click="closePopup" style="background-color: red;">Close</button>
      </div>
    </div>

    <!-- Payment Response Popup -->
    <div v-if="showPaymentResponse" class="payment-response-overlay">
      <div class="payment-response">
        <h3>Payment Successful!</h3>
        <p>{{ paymentResponse.message }}</p>
      </div>
    </div>
    <button @click="$router.push('/')">BACK TO HOME</button>
  </div>
</template>

<script>
export default {

  methods: {
  addtell() {
    console.log("telmemmber",this.tellNumber); 
  }
}
,
  data() {
    return {
      products: [],
      error: null,
      showPopup: false,
      selectedProduct: null,
      money: {
        100: 0,
        50: 0,
        20: 0,
        10: 0,
        5: 0,
        2: 0,
        1: 0,
      },
      denominations: [100, 50, 20, 10, 5, 2, 1],
      showPaymentResponse: false,
      paymentResponse: null,
      tellRes : null,
      tellNumber: '', 
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('/api/sellproduct');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.products = await response.json();
      } catch (error) {
        this.error = error;
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    },
    openPopup(product) {
      this.selectedProduct = product;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.selectedProduct = null;
      this.resetMoney();
    },
    resetMoney() {
      this.money = {
        100: 0,
        50: 0,
        20: 0,
        10: 0,
        5: 0,
        2: 0,
        1: 0,
      };
    },
    async addTellNumber() {
    console.log("tellNumber: ", this.tellNumber);
    const response = await fetch('/api/getmember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tellNumber: this.tellNumber }),
    });

    const data = await response.json();
    this.tellRes = data; // เก็บค่าผลลัพธ์จาก API
    console.log(data); 
  }
,

    async payProduct() {
      const paymentData = [];

 
      for (let denomination of this.denominations) {
        if (this.money[denomination] > 0) {
     
          paymentData.push({
            price: denomination,
            amount: this.money[denomination],
          });
        }
      }

      try {
        const response = await fetch(`/api/sellproduct/?productid=${this.selectedProduct.id}&tellNumber=${this.tellNumber}`, {
          method: 'PUT',
          headers: {
            'accept': '*/*',
            'content-type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Payment successful:', data);

        
          this.paymentResponse = data;
          this.showPaymentResponse = true;

     
          setTimeout(() => {
            this.closePopup();
            this.showPaymentResponse = false;
          }, 3000); 
        } else {
          console.error('Error during payment:', response.statusText);
        }
      } catch (error) {
        console.error('Payment failed:', error);
      }
    },

 
    changeMoney(denomination, amount) {
      if (this.money[denomination] + amount >= 0) {
        this.money[denomination] += amount;
      }
    },
  },
  computed: {
    gridStyles() {
      const columns = 3;
      const rows = Math.ceil(this.products.length / columns);
      return {
        gridTemplateColumns: `repeat(${columns}, minmax(200px, 1fr))`,
        gridTemplateRows: `repeat(${rows}, auto)`,
      };
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.product-grid {
  display: grid;
  gap: 20px;
  padding: 20px;
}

.product-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

.product-item:hover {
  transform: translateY(-10px);
}

.product-image {
  width: 350px;
  height: 500px;
}

.product-info {
  padding: 15px;
}

.product-info h3 {
  font-size: 1.2rem;
  margin: 10px 0;
}

.product-info p {
  margin: 5px 0;
  font-size: 0.9rem;
}

button {
  background-color: #00796b;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #004d40;
}

.error-message, .loading-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  color: #f44336;
}

.loading-message {
  color: #00796b;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
}

.popup-image {
  width: 100px;
  height: 200px;
}

.money-input {
  margin: 20px 0;
}

.money-input label {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  align-items: center;
}

.money-control {
  display: flex;
  align-items: center;
}

.money-btn {
  background-color: #00796b;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  width: 35px;
  height: 35px;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.money-btn:hover {
  background-color: #004d40;
}

.money-input-field {
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ccc;
  margin: 0 10px;
  border-radius: 5px;
}

.money-input-field:focus {
  outline: none;
  border-color: #00796b;
}

.payment-response-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-response {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
}
</style>
