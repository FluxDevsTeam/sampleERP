import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Product {
  id: number;
  name: string;
  quantity: number;
  progress: string;
  overhead_cost: number;
  total_production_cost: number;
  selling_price: number;
  profit: number;
}


export const fetchProducts = async () => {
    const { data } = await axios.get(
      "https://kidsdesigncompany.pythonanywhere.com/api/product/"
    );
    console.log("Fetched Data:", data);
    return data;
  }; 

 
const API_URL = "https://kidsdesigncompany.pythonanywhere.com/api/product"; 

// **Update Project (PATCH)**
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<Product> }) => {
      const response = await axios.patch(`${API_URL}/${id}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Refetch updated data
    },
  });
};

// **Delete Project (DELETE)**
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Refetch data
    },
  });
};