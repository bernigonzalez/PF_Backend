const { CORS_URL } = process.env;


const bodyPago = {
    payer_email: process.env.PAYER_EMAIL,
    items: [
      {
        title: "Tienda de Muebles",
        description: "Tienda de muebles",
        picture_url: "https://png.pngtree.com/png-clipart/20190520/original/pngtree-girl-taking-a-taxi-out-taxitrunktravel-png-image_4032278.jpg",
        category_id: "category123",
        quantity: 1,
        unit_price: 100
      }
    ],
    back_urls: {
      failure:  CORS_URL + "/pago",
      pending: "/pending",
      success: CORS_URL + "/pago"
    },
    payment_methods: {
        excluded_payment_types: [
            {
                id: "ticket"
            }
        ],
          installments: 12
      }
  }

  module.exports = bodyPago