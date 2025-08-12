import axios from 'axios';

export interface BalanceSwitch {
  id: number;
  from_method: 'CASH' | 'BANK' | 'POS';
  to_method: 'CASH' | 'BANK' | 'POS';
  amount: string;
  switch_date: string;
}

export interface BalanceSwitchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BalanceSwitch[];
}

const BALANCE_SWITCH_API_URL = "https://backend.kidsdesigncompany.com/api/balance-switch/";

export const fetchBalanceSwitches = async (page: number = 1): Promise<BalanceSwitchResponse> => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(`${BALANCE_SWITCH_API_URL}?page=${page}`, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return data;
};

export const createBalanceSwitch = async (balanceSwitch: Omit<BalanceSwitch, 'id'>): Promise<BalanceSwitch> => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.post(BALANCE_SWITCH_API_URL, balanceSwitch, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return data;
};

export const updateBalanceSwitch = async (id: number, balanceSwitch: Partial<Omit<BalanceSwitch, 'id'>>): Promise<BalanceSwitch> => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.patch(`${BALANCE_SWITCH_API_URL}${id}/`, balanceSwitch, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return data;
};

export const fetchBalanceSwitchById = async (id: number): Promise<BalanceSwitch> => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(`${BALANCE_SWITCH_API_URL}${id}/`, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return data;
};

export const deleteBalanceSwitch = async (id: number): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");
  await axios.delete(`${BALANCE_SWITCH_API_URL}${id}/`, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
};