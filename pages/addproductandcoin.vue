<template>
  <div>
    <h1>ADD PRODUCT AND COIN</h1>
    
    <!-- Button to open Product Form -->
    <button @click="showPopupProduct = true">Add Product</button>
    
    <!-- Button to open Coin Form -->
    <button @click="showPopupCoin = true">Add Coin</button>

    <!-- Product Popup Form -->
    <div v-if="showPopupProduct" class="popup-overlay" @click="closePopupProduct">
      <div class="popup-content" @click.stop>
        <h2>Add Product</h2>
        <form @submit.prevent="addProduct">
          <div>
            <label for="name">Product Name:</label>
            <input type="text" v-model="product.name" id="name" required />
          </div>
          <div>
            <label for="price">Price:</label>
            <input type="number" v-model="product.price" id="price" required />
          </div>
          <div>
            <label for="picture_url">Picture URL:</label>
            <input type="url" v-model="product.picture_url" id="picture_url" required />
          </div>
          <button type="submit">Add Product</button>
          <button type="button" @click="closePopupProduct">Cancel</button>
        </form>
      </div>
    </div>

    <!-- Coin Popup Form -->
    <div v-if="showPopupCoin" class="popup-overlay" @click="closePopupCoin">
      <div class="popup-content coin-popup" @click.stop>
        <h2>Add Coin</h2>
        
        <div class="coin-buttons">
          <div v-for="coin in coins" :key="coin" class="coin-item">
            <button @click="selectCoin(coin)">
              {{ coin }}
            </button>
            <input 
              v-if="selectedCoins[coin]" 
              type="number" 
              v-model="selectedCoins[coin].quantity" 
              :min="1" 
              placeholder="Qty" 
              class="quantity-input" 
            />
          </div>
        </div>     

        <!-- Add Coin Button -->
        <button @click="submitCoinData">Add Coins</button>
        <br>
        <button @click="closePopupCoin">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPopupProduct: false, // Controls visibility of product popup
      showPopupCoin: false, // Controls visibility of coin popup
      product: {
        name: '',
        price: '',
        picture_url: ''
      },
      coins: [100, 50, 20, 10, 5, 2, 1], // Available coin denominations
      selectedCoins: {} // Store selected coins and their quantities
    };
  },
  methods: {
    async addProduct() {
      console.log('Product added:', this.product);
      
      // Prepare data to send
      const requestData = {
        product: this.product,
        coins: this.selectedCoins
      };

      // Send the product and coin data to the backend using fetch
      try {
        const response = await fetch('/api/addproductandcoin', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error('Failed to send data');
        }

        const data = await response.json();
        console.log('Product and coin data sent successfully', data);
        
        // Close popups after successful submission
        this.closePopupProduct();
        this.closePopupCoin();
      } catch (error) {
        console.error('Error sending data:', error);
      }
    },
    closePopupProduct() {
      this.showPopupProduct = false;
      this.product.name = '';
      this.product.price = '';
      this.product.picture_url = '';
    },
    selectCoin(coin) {
      // If coin hasn't been selected before, initialize it with quantity 1
      if (!this.selectedCoins[coin]) {
        this.selectedCoins[coin] = {
          value: coin,
          quantity: 1
        };
      }
    },
    closePopupCoin() {
      this.showPopupCoin = false;
      // Keep the selected coins for further use, no need to reset them.
    },
    async submitCoinData() {
      // Create a list of selected coins with the required structure (only price and quantity)
      const coinsData = Object.keys(this.selectedCoins).map(coin => {
        return {
          price: this.selectedCoins[coin].value,
          amount: this.selectedCoins[coin].quantity
        };
      });

      // Prepare data to send
      const requestData = {
        coins: coinsData
      };

      // Send the coin data to the backend using fetch
      try {
        const response = await fetch('/api/addcoin', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error('Failed to send coin data');
        }

        const data = await response.json();
        console.log('Coin data sent successfully', data);
        
        // Close the coin popup after successful submission
        this.closePopupCoin();
      } catch (error) {
        console.error('Error sending coin data:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Styles for the popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
}

.coin-popup {
  width: 300px;
}

button {
  margin-top: 10px;
}

form div {
  margin-bottom: 10px;
}

.coin-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.coin-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.coin-buttons button {
  width: 60px;
  height: 40px;
  font-size: 16px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  cursor: pointer;
}

.coin-buttons button:hover {
  background-color: #dcdcdc;
}

.quantity-input {
  width: 60px;
  padding: 5px;
  font-size: 16px;
}
</style>
