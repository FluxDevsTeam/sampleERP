// src/pages/admin/assets/_api/apiService.ts
import assetsData from "@/data/admin/assets/assets.json";

export interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
  date_added?: string;
  end_date?: string;
  note?: string;
}

export interface AssetSummary {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    assets: Asset[];
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
  date_added?: string;
  end_date?: string;
  note?: string;
}

// Fetch all assets and summary data from static JSON
export const AssetsData = async (params?: { search?: string; is_still_available?: boolean; show_deprecated?: boolean }): Promise<AssetSummary> => {
  let filteredAssets = assetsData.results.assets;

  if (params?.search) {
    filteredAssets = filteredAssets.filter((asset) =>
      asset.name.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  if (params?.is_still_available !== undefined) {
    filteredAssets = filteredAssets.filter((asset) => asset.is_still_available === params.is_still_available);
  } else if (params?.show_deprecated) {
    filteredAssets = filteredAssets.filter((asset) => !asset.is_still_available);
  }

  return {
    ...assetsData,
    results: {
      ...assetsData.results,
      assets: filteredAssets,
      total_assets_count: filteredAssets.length,
      good_assets_count: filteredAssets.filter((asset) => asset.is_still_available).length,
      good_assets_value: filteredAssets
        .filter((asset) => asset.is_still_available)
        .reduce((sum, asset) => sum + asset.value, 0),
      depreciated_assets_count: filteredAssets.filter((asset) => !asset.is_still_available).length,
    },
  };
};