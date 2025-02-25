import { useContext } from 'react';
import useHttp from '../hooks/useHttp.js';
import UserProgressContext from '../store/UserProgressContext.jsx';
import Error from './Error.jsx';
import Orders from './Orders.jsx';
import Modal from './UI/Modal.jsx';
import Button from './UI/Button.jsx';

const requestConfig = {};

export default function MyOrders() {
 const userProgressCtx = useContext(UserProgressContext);
  const {
    data: loadedOldOrders,
    isLoading,
    error,
  } = useHttp('http://localhost:3000/get-orders', requestConfig, []);

  if (isLoading) {
    return <p className="center">Fetching Old Orders...</p>;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }
  function handleClose(){
    userProgressCtx.hideOldOrders();
  }

  function handleFinish(){
    console.log("Noting")
  }
//   if (!data) {
//     return <p>No Old Orders found.</p>
//   }

    return (
        <Modal className = "my-orders-modal"
            open={userProgressCtx.progress === "myOldOrders"}
            onClose={handleFinish}>
            <h2 className='align-center'>My Orders</h2>
            <ul id="meals">
                {loadedOldOrders.map((order) => (
                    <Orders key={order.id} order={order} />
                ))}
            </ul>

            <Button className="close-button" type='button' onClick={handleClose}>
              Close
            </Button>
        </Modal>
    );
}
