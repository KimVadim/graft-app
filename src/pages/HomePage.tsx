import React, { useState } from 'react';
import { Order } from './Order';
import { AddFloatButton } from '../components/AddFloatButton';
import { AddExpenseModal } from './Expenses/AddExpenseModal';
import { AddOrderModal } from '../components/AddOrderModal';

interface HomePageProps {
  view: string;
}

export const HomePage: React.FC<HomePageProps> = ({view}) => {
  const [isAddOrder, setIsAddOrder] = useState(false);
  const [isAddExpense, setIsAddExpense] = useState(false)
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {view === 'Opportunity' && <Order />}
      <AddFloatButton
        setIsAddOrder={setIsAddOrder}
        setIsAddExpense={['Opportunity'].includes(view) ? setIsAddExpense : undefined }
      />
      {isAddOrder && <AddOrderModal
        setIsAddOrder={setIsAddOrder} isAddOrder={isAddOrder}
        setLoading={setLoading} loading={loading} view={view}
      />}
      {isAddExpense && <AddExpenseModal
        setIsAddExpense={setIsAddExpense} isAddExpense={isAddExpense}
      />}
    </div>
  );
}

export default HomePage;
