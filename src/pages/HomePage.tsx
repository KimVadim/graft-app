import React from 'react';
import { Order } from './Order';

interface HomePageProps {
  view: string;
}

export const HomePage: React.FC<HomePageProps> = ({view}) => {

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {view === 'Order' && <Order />}
    </div>
  );
}

export default HomePage;
