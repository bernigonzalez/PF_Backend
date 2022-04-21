const axios = require('axios');

module.exports = async () => {
   let data = {};
   const urlAPI = "https://fakestoreapi.com/products";

   try {
      const response = await axios.get(urlAPI);
      data.products = response.data;
   } catch (err) {
      // console.log(err);
      data.error = {
         status: err.response.status,
         message: err.response.statusText
      };
   }

   return data;
}