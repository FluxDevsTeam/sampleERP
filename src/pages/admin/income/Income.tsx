import React, { useEffect, useState } from 'react';
import incomeSummary from '@/data/admin/income/incomeSummary.json';
import IncomeData from './_components/IncomeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faWallet, faUniversity, faChartLine, faMoneyBillWave, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import AddIncomeModal from './_components/AddIncomeModal';
import IncomeTable from './_components/IncomeTable';
import BalanceSwitch from './_components/BalanceSwitch';
import { Button } from '@/components/ui/button';

interface IncomeSummary {
  monthly_total: number;
  current_month_cash_total: number;
  current_month_bank_total: number;
  cash_at_hand: number;
  money_in_bank: number;
  debt: number;
}

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

  useEffect(() => {
    if (incomeSummary) {
      setMonthlyTotal(incomeSummary.monthly_total);
      setCashMonthTotal(incomeSummary.current_month_cash_total);
      setBankMonthTotal(incomeSummary.current_month_bank_total);
      setCashAtHand(incomeSummary.cash_at_hand);
      setMoneyInBank(incomeSummary.money_in_bank);
      setDebt(incomeSummary.debt ?? 0);
    }
  }, []);

  return (
    <div className="wrapper w-full mx-auto my-0 md:mb-2 mb-20 md:pt-2">
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-2 md:mt-4 ${isTableModalOpen ? 'blur-md' : ''}`}>
        <IncomeData info="Cash at Hand" digits={cashAtHand} currency="₦ " icon={<FontAwesomeIcon icon={faWallet} />} />
        <IncomeData info="Money in Bank" digits={moneyInBank} currency="₦ " icon={<FontAwesomeIcon icon={faUniversity} />} />
        <IncomeData info="Debt" digits={debt} currency="₦ " icon={<FontAwesomeIcon icon={faCreditCard} />} />
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
              className="border border-blue-400 text-blue-400 bg-white hover:bg-blue-400 hover:text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
            >
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