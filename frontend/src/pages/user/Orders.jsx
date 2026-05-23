import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);

      // 🔥 if token expired
      if (err.response?.status === 401) {
        alert("Session expired. Please login again ❌");
        localStorage.clear();
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/user_dashboard")}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">My Orders 📦</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">

          {orders.map((order) => (
            
            <div
              key={order._id}
              className="bg-white p-4 rounded-xl shadow"
            >
              
              <h2 className="font-bold mb-2">
                Order ID: {order._id}
              </h2>

              <p className="text-gray-500 mb-2">
                Total: ₹ {order.total}
              </p>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  
                  <div
                    key={index}
                    className="flex justify-between border-b pb-1"
                  >
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                    
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Orders;