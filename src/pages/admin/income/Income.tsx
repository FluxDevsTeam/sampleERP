import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchIncomeSummary, IncomeSummary } from './_api/apiService';
import IncomeData from './_components/IncomeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faWallet, faUniversity, faChartLine, faMoneyBillWave, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import AddIncomeModal from './_components/AddIncomeModal';
import IncomeTable from './_components/IncomeTable';
import BalanceSwitch from './_components/BalanceSwitch';
import { Button } from '@/components/ui/button';

const Income = () => {
  document.title = 'Income - KDC Admin';
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTableModalOpen] = useState(false);

  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [cashMonthTotal, setCashMonthTotal] = useState(0);
  const [bankMonthTotal, setBankMonthTotal] = useState(0);
  const [cashAtHand, setCashAtHand] = useState(0);
  const [moneyInBank, setMoneyInBank] = useState(0);
  const [debt, setDebt] = useState(0);

  const { data, isLoading, error } = useQuery<IncomeSummary, Error>({
    queryKey: ['income-summary'],
    queryFn: fetchIncomeSummary,
  });

  useEffect(() => {
    if (data) {
      setMonthlyTotal(data.monthly_total);
      setCashMonthTotal(data.current_month_cash_total);
      setBankMonthTotal(data.current_month_bank_total);
      setCashAtHand(data.cash_at_hand);
      setMoneyInBank(data.money_in_bank);
      setDebt((data as any).debt ?? 0);
    }
  }, [data]);

  if (isLoading) return <p>Loading income data...</p>;
  if (error) return <p>Error loading income: {error.message}</p>;

  return (
    <div className="wrapper w-full mx-auto my-0 md:mb-2 mb-20 pt-2">
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2 mt-4 ${isTableModalOpen ? 'blur-md' : ''}`}>
        <IncomeData info="Cash at Hand" digits={cashAtHand} currency="₦ " icon={<FontAwesomeIcon icon={faWallet} />} />
        <IncomeData info="Money in Bank" digits={moneyInBank} currency="₦ " icon={<FontAwesomeIcon icon={faUniversity} />} />
        <IncomeData info="Debt" digits={debt} currency="₦ " icon={<FontAwesomeIcon icon={faCreditCard} />} />
        {/* <IncomeData info="Bank (This Month)" digits={bankMonthTotal} currency="₦ " icon={<FontAwesomeIcon icon={faCreditCard} />} />
        <IncomeData info="Cash (This Month)" digits={cashMonthTotal} currency="₦ " icon={<FontAwesomeIcon icon={faMoneyBillWave} />} /> */}
        <IncomeData info="Monthly Total" digits={monthlyTotal} currency="₦ " icon={<FontAwesomeIcon icon={faChartLine} />} />
      </div>

      <div>
        <div className="grid grid-cols-2 items-center gap-2 mt-2 mb-2">
          <h1 style={{ fontSize: 'clamp(16.5px, 3vw, 30px)' }} className={`font-semibold py-2 m-0 ${isTableModalOpen ? 'blur-md' : ''}`}>
            Income Items
          </h1>
          <div className="flex justify-end gap-2 ">
            <BalanceSwitch />
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              Add Income
            </Button>
          </div>
        </div>
        <AddIncomeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        <div className={`${isTableModalOpen ? 'blur-md' : ''}`}>
          <IncomeTable isTableModalOpen={isTableModalOpen} />
        </div>
      </div>
    </div>
  );
};

export default Income;
