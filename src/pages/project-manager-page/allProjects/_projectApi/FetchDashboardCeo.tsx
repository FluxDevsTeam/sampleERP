import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Project {
  id: string;
  name: string;
  is_delivered: boolean;
  deadline: string;
  start_date: string;
  status:string;
}

export const fetchCeoDashboard = async () => {
  const { data } = await axios.get(
    "https://kidsdesigncompany.pythonanywhere.com/api/ceo-dashboard/"
  );
  return data;
};

export const fetchCeoProjects = async () => {
  const { data } = await axios.get(
    "https://kidsdesigncompany.pythonanywhere.com/api/project/"
  );
  return data;
};



const API_URL = "https://kidsdesigncompany.pythonanywhere.com/api/project"; 

// **Update Project (PATCH)**
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<Project> }) => {
      const response = await axios.patch(`${API_URL}/${id}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Refetch updated data
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
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Refetch data
    },
  });
};