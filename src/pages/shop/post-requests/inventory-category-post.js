import axios from "axios";

const data = [
  {
    name: "black bedside lamps",
    inventory_category: {
      id: 3,
      name: "bedside lamps",
    },
    description: "This is a beautiful black bedside lamp.",
    // image:
    //   "https://kidsdesigncompany.pythonanywhere.com/media/shop/asluxery_4RZewKE.jpg",
    stock: 38,
    cost_price: 1500.0,
    selling_price: 3000.0,
    dimensions: "3000*3211cm",
    archived: true,
    profit_per_item: 1500.0,
    total_price: 114000.0,
  },
];

data.forEach(async (item) => {
  try {
    const response = await axios.post(
      "https://kidsdesigncompany.pythonanywhere.com/api/inventory-item/",
      item,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Data inserted successfully:", response.data);
  } catch (error) {
    console.error(
      "Error inserting data:",
      error.response ? error.response.data : error.message
    );
  }
});
