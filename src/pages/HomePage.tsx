import React, { useState } from 'react';
import { Opportunity } from './Order';
import { AddFloatButton } from '../components/AddFloatButton';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { AddOrderModal } from '../components/AddOrderModal';

interface HomePageProps {
  view: string;
}

export const HomePage: React.FC<HomePageProps> = ({view}) => {
  const [isAddOpty, setIsAddOpty] = useState(false);
  const [isAddExpense, setIsAddExpense] = useState(false)
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
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
  );
}

export default HomePage;
