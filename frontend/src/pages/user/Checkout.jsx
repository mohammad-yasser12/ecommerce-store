import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
const token = localStorage.getItem("token");
  // 💳 STEP 1: Razorpay Payment Handler
const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    // 1. Create order in backend
    const { data: order } = await API.post(
      "/payment/create-order",
      { amount: total },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // 2. Razorpay options
    const options = {
      key: "rzp_test_xxxxxxxx", // your KEY ID only (NOT secret)
      amount: order.amount,
      currency: order.currency,
      name: "My Store",
      description: "Order Payment",
      order_id: order.id,

      handler: async function (response) {
        try {
          // 3. Verify payment in backend
          await API.post(
            "/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          alert("Payment Successful ✅");

          dispatch(clearCart());
          navigate("/orders");
        } catch (err) {
          console.log(err);
          alert("Payment verification failed ❌");
        }
      },

      theme: {
        color: "#3399cc",
      },
    };

    // 4. Open Razorpay popup
    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.log(err);
    alert("Payment failed ❌");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <button
        onClick={() => navigate("/cart")}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to Cart
      </button>

      <h1 className="text-2xl font-bold mb-6">Checkout 💳</h1>

      {/* ORDER SUMMARY */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="font-bold mb-3">Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>₹ {item.price * item.quantity}</span>
          </div>
        ))}

        <hr className="my-2" />

        <h3 className="font-bold">Total: ₹ {total}</h3>
      </div>

      {/* PAYMENT */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="font-bold mb-3">Payment Method</h2>
        <p className="text-gray-500">
          Secure payment via Razorpay 💳
        </p>
      </div>

      {/* BUTTON */}
      <button
        onClick={handlePayment}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
      >
        Pay Now 💳
      </button>

    </div>
  );
}

export default Checkout;