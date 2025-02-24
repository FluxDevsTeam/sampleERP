import axios from "axios";


export const fetchProducts = async () => {
    const { data } = await axios.get(
      "https://kidsdesigncompany.pythonanywhere.com/api/product/"
    );
    console.log("Fetched Data:", data);
    return data;
  }; 

  /*export const fetchProducts = async () => {
    const response = await fetch("https://kidsdesigncompany.pythonanywhere.com/api/product/");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    console.log("API Response:", data); // Debugging API response
    return data.products || []; // Ensure it returns an array
  }; */
  