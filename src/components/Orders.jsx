import { useContext } from 'react';
import Button from './UI/Button.jsx';
import { currencyFormatter } from '../util/formatting.js';
import CartContext from '../store/CartContext.jsx';

import "../styles/orders.css"
import UserProgressContext from '../store/UserProgressContext.jsx';
export default function Orders({ order }) {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  function handleReOrder(){
    cartCtx.items = order.items;
    userProgressCtx.showCart();
  
    console.log("re order")
  }
  return (
    <div>
      {/* Order Title */}
      <h3 className="text-xl font-bold text-black mb-4">#{order.orderId}</h3>
      <h3 className="text-lg font-semibold text-gray-900">{order.name}</h3>

      {/* Orders Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center border-b pb-2 mb-2">
            <p className="text-gray-800 font-medium">
              {item.name} × {item.quantity}
            </p>
            <p className="text-gray-700 font-semibold">
              {currencyFormatter.format(item.price)}
            </p>
          </div>
        ))}
      </div>

      {/* Re-order Section */}
      <div className='re-order-button'>
        <Button type='button' onClick={handleReOrder}>
          Re-order
        </Button>
      </div>
    </div>
  );
}
