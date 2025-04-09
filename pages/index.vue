<template>
  <div>
    <nav>
      <!-- <nuxt-link to="addcoin">AND COIN</nuxt-link> -->
      <nuxt-link to="sellproduct">SELL PRODUCT</nuxt-link>
    </nav>

  </div>
</template>

<script setup>
  // You can put your script logic here
</script>

<style scoped>

html, body {
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
}

nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0; /* Removed margin-top to center properly */
}

nav a {
  text-decoration: none;
  color: #ffffff;
  background-color: #007bff;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

nav a:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

nav a:active {
  background-color: #003f7f;
}
</style>
  