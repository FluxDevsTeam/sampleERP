export interface Project {
    id: number;
    name: string;
    paid: number;
    balance: string;
  }
  
  export interface ShopItem {
    id: number;
    name: string;
    quantity: string;
    cost_price: string;
    selling_price: string;
    total_price: number;
  }
  
  export interface CustomerDetails {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    address: string;
    project: Project[];
    shop_item: ShopItem[];
    created_at: string;
  }
  
  export interface CustomerResponse {
    total_projects_count: number;
    active_projects_count: number;
    total_projects_cost: number;
    total_shop_items_count: number;
    total_shop_items_cost: number;
    customer_details: CustomerDetails;
  }
  