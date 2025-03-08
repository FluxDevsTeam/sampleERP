import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const BASE_URL = "https://kidsdesigncompany.pythonanywhere.com/api/assets/";


// Type definitions
export interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
  get_total_value: number;
}

export interface AssetsResponse {
  assets: Asset[];
}

export interface AssetData {
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
}

// Fetch all assets
export const AssetsData = async (): Promise<AssetsResponse> => {
  const { data } = await axios.get(BASE_URL);
  return data;
};

// Create asset mutation
export const useCreateAsset = () => {
  return useMutation({
    mutationFn: async (newAsset: AssetData) => {
      const { data } = await axios.post(BASE_URL, newAsset);
      return data;
    },
  });
};

// Update asset mutation
export const useUpdateAsset = () => {
  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: AssetData }) => {
      const { data } = await axios.put(`${BASE_URL}${id}/`, updatedData);
      return data;
    },
  });
};
