import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const BASE_URL = "https://backend.kidsdesigncompany.com/api/assets/";

// Create an axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
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

// Defining the AssetSummary interface that includes the aggregate data
export interface AssetSummary {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    assets: Asset[]; // Assuming assets array is nested under results too
    total_assets_count: number;
    good_assets_count: number;
    good_assets_value: number;
    depreciated_assets_count: number;
  };
}

export interface AssetData {
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
}

// Fetch all assets and summary data
export const AssetsData = async (params?: { search?: string; is_still_available?: boolean; show_deprecated?: boolean }): Promise<AssetSummary> => {
  const urlParams = new URLSearchParams();
  if (params?.search) {
    urlParams.append("search", params.search);
  }
  if (params?.is_still_available !== undefined) {
    urlParams.append("is_still_available", String(params.is_still_available));
  }
  // Note: show_deprecated isn't directly supported by the current API based on the interface. 
  // I'm assuming `is_still_available=false` handles deprecated assets, 
  // or the backend needs to be updated to support a separate `show_deprecated` param.
  // For now, I'll use `is_still_available`.

  const { data } = await api.get(`?${urlParams.toString()}`);
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
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: number;
      updatedData: AssetData;
    }) => {
      const { data } = await api.put(`${id}/`, updatedData);
      return data;
    },
  });
};
