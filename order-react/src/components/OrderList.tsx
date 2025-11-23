import React from 'react';
import { useOrders } from '../context/OrderContext';

export interface Order {
  id: string | number;
  number?: number;
  orderitems?: any[];
  // Add other fields as needed
}

const OrderList: React.FC = () => {
  const { orders, loading, showNumber, openAmount } = useOrders();

  if (loading) return <div>Loading orders...</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div>
      <h3>Orders</h3>
      <ul>
        {orders.map((order: Order) => (
          <li key={order.id}>
            <strong>{showNumber(order)}</strong> — Open Amount: {openAmount(order)} €
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
