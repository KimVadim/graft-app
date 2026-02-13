import React, { useState } from 'react';
import { Opportunity } from './Opportunity.tsx';
import { AddFloatButton } from '../components/AddFloatButton.tsx';
import { AddExpenseModal } from '../components/AddExpenseModal.tsx';
import { AddOrderModal } from '../components/AddOrderModal.tsx';

interface HomePageProps {
  view: string;
}

export const HomePage: React.FC<HomePageProps> = ({view}) => {
  const [isAddOpty, setIsAddOpty] = useState(false);
  const [isAddExpense, setIsAddExpense] = useState(false)
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <>
      <div style={{ padding: 5, display: 'flex', justifyContent: 'center' }}>
        {view === 'Opportunity' && <Opportunity />}
        <AddFloatButton
          setIsAddOpty={setIsAddOpty}
          setIsAddExpense={['Opportunity'].includes(view) ? setIsAddExpense : undefined }
        />
        {isAddOpty && <AddOrderModal
          setIsAddOpty={setIsAddOpty} isAddOpty={isAddOpty}
          setLoading={setLoading} loading={loading} view={view}
        />}
        {isAddExpense && <AddExpenseModal
          setIsAddExpense={setIsAddExpense} isAddExpense={isAddExpense}
        />}
      </div>
    </>
  );
}

export default HomePage;
