import axios from "axios";
const BASE_URL = "https://backend.kidsdesigncompany.com/api/expense/";


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
  


export const AssetsData = async (): Promise<AssetsResponse> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  };