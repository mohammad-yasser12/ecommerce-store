import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.cartItems);

  const navigate = useNavigate();
  const location = useLocation();

  // Buy Now product OR cart
  const buyNowProduct = location.state?.product;

  const checkoutItems = buyNowProduct
    ? [{ ...buyNowProduct, quantity: 1 }]
    : cartItems;

  // =========================
  // PRICE CALCULATION
  // =========================

  const subtotal = checkoutItems.reduce((acc, item) => {
    const price = item?.product?.price ?? item?.price ?? 0;
    const qty = item?.quantity ?? 1;
    return acc + price * qty;
  }, 0);

  const totalDiscount = checkoutItems.reduce((acc, item) => {
    const price = item?.product?.price ?? item?.price ?? 0;
    const qty = item?.quantity ?? 1;
    const itemTotal = price * qty;

    let discount = 0;

    if (item?.type === "percentage") {
      discount = (itemTotal * item.value) / 100;
    }

    if (item?.type === "fixed") {
      discount = item.value;
    }

    return acc + discount;
  }, 0);

  const deliveryCharge = subtotal > 1000 ? 0 : 50;
  const codCharge = 0;

  const total = subtotal - totalDiscount + deliveryCharge + codCharge;

  // =========================
  // PAYMENT HANDLER
  // =========================

const handlePayment = async () => {
  try {
    const res = await API.post("/payment/create-order", {
      items: checkoutItems,
      total: total
    });

    const order = res.data;

    console.log("RAZORPAY ORDER:", order);
const options = {
  key: "rzp_test_SpOmHpylMMkkWY",  // 🔥 SAME AS BACKEND
  amount: order.amount,
  currency: order.currency,
  order_id: order.order_id,

  name: "My Store",
  description: "Order Payment",

  handler: async function (response) {
    console.log("PAYMENT RESPONSE:", response);

    await API.post("/payment/verify", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });
  },

  theme: {
    color: "#3399cc"
  }
};

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log("Payment error:", err);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <button
        onClick={() => navigate("/cart")}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Checkout 💳</h1>

      {/* SUMMARY */}
      <div className="bg-white p-4 rounded-xl shadow space-y-2 text-sm">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹ {subtotal}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>- ₹ {totalDiscount}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₹ {deliveryCharge}</span>
        </div>

        <div className="flex justify-between">
          <span>COD</span>
          <span>₹ {codCharge}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹ {total}</span>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="bg-white p-4 mt-4 rounded-xl shadow">
        <p className="text-gray-600">Pay securely via Razorpay</p>
      </div>

      <button
        onClick={handlePayment}
        className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
      >
        Pay Now 💳
      </button>
    </div>
  );
}

export default Checkout;