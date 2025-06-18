import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const BASE_URL = "https://backend.kidsdesigncompany.com/api/assets/";

// Create an axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

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
  const { data } = await api.get("");
  return data;
};

// Create asset mutation
export const useCreateAsset = () => {
  return useMutation({
    mutationFn: async (newAsset: AssetData) => {
      const { data } = await api.post("", newAsset);
      return data;
    },
  });
};

// Update asset mutation
export const useUpdateAsset = () => {
  return useMutation({
    mutationFn: async ({ id, updatedData }: { id: number; updatedData: AssetData }) => {
      const { data } = await api.put(`${id}/`, updatedData);
      return data;
    },
  });
};