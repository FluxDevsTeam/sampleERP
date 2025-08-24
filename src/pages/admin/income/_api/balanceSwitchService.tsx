import balanceSwitchesData from '@/data/admin/income/balanceSwitches.json';

export interface BalanceSwitch {
  id: number;
  from_method: 'CASH' | 'BANK' | 'POS' | 'DEBT';
  to_method: 'CASH' | 'BANK' | 'POS' | 'DEBT';
  amount: string;
  switch_date: string;
}

export interface BalanceSwitchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BalanceSwitch[];
}

export const fetchBalanceSwitches = async (page: number = 1): Promise<BalanceSwitchResponse> => {
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const results = balanceSwitchesData.results.slice(start, end);
  return {
    count: balanceSwitchesData.results.length,
    next: end < balanceSwitchesData.results.length ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results,
  };
};

export const createBalanceSwitch = async (balanceSwitch: Omit<BalanceSwitch, 'id'>): Promise<BalanceSwitch> => {
  // Simulate adding to JSON (in a real app, you'd write to the JSON file)
  const newId = balanceSwitchesData.results.length + 1;
  const newSwitch: BalanceSwitch = { id: newId, ...balanceSwitch };
  balanceSwitchesData.results.unshift(newSwitch); // Add to the top
  return newSwitch;
};

export const updateBalanceSwitch = async (id: number, balanceSwitch: Partial<Omit<BalanceSwitch, 'id'>>): Promise<BalanceSwitch> => {
  // Simulate updating JSON
  const index = balanceSwitchesData.results.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Balance switch not found');
  const updatedSwitch = { ...balanceSwitchesData.results[index], ...balanceSwitch };
  balanceSwitchesData.results[index] = updatedSwitch;
  return updatedSwitch;
};

export const fetchBalanceSwitchById = async (id: number): Promise<BalanceSwitch> => {
  const balanceSwitch = balanceSwitchesData.results.find((item) => item.id === id);
  if (!balanceSwitch) throw new Error('Balance switch not found');
  return balanceSwitch;
};

export const deleteBalanceSwitch = async (id: number): Promise<void> => {
  // Simulate deleting from JSON
  const index = balanceSwitchesData.results.findIndex((item) => item.id === id);
  if (index === -1) throw new Error('Balance switch not found');
  balanceSwitchesData.results.splice(index, 1);
};