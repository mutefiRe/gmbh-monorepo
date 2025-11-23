import React from 'react';
import OrderList from '../components/OrderList';
import OrderMain from '../components/OrderMain';

const Home: React.FC = () => {
  return (
    <div>
      <h2>Order Home</h2>
      <OrderMain />
      <OrderList />
    </div>
  );
};

export default Home;
