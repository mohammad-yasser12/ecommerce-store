import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/cartSlice";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  console.log(cartItems,"<<< checkout items");
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Buy Now Product
  const buyNowProduct = location.state?.product;

  // ✅ If Buy Now → single product
  // ✅ Else → cart items
  const checkoutItems = buyNowProduct
    ? [{ ...buyNowProduct, quantity: 1 }]
    : cartItems;

  // ✅ Total Price
  // const total = checkoutItems.reduce(
  //   (acc, item) => acc + item.price * item.quantity,
  //   0
  // );

  // 💳 Payment Handler
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Create Razorpay Order
      const { data: order } = await API.post(
        "/payment/create-order",
        { amount: total },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2️⃣ Razorpay Options
      const options = {
        key: "rzp_test_xxxxxxxx", // Replace with your Razorpay KEY ID
        amount: order.amount,
        currency: order.currency,
        name: "My Store",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            // 3️⃣ Verify Payment
            await API.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("Payment Successful ✅");

            // ✅ Clear cart ONLY for cart checkout
            if (!buyNowProduct) {
              dispatch(clearCart());
            }

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

      // 4️⃣ Open Razorpay
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
    }
  };

let subtotal = 0;
let totalDiscount = 0;

checkoutItems.forEach((item) => {
  const price =
    item?.product?.price ??
    item?.price ??
    0;

  const quantity = item?.quantity ?? 1;

  const itemTotal = price * quantity;

  const promo = item;

  let discount = 0;

  if (promo?.type === "percentage") {
    discount = (itemTotal * promo.value) / 100;
  }

  if (promo?.type === "fixed") {
    discount = promo.value;
  }

  subtotal += itemTotal;
  totalDiscount += discount;
});

const deliveryCharge = subtotal > 1000 ? 0 : 50;
const codCharge = 0;

const total =
  subtotal - totalDiscount + deliveryCharge + codCharge;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <button
        onClick={() => navigate("/cart")}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to Cart
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Checkout 💳
      </h1>

      {/* ORDER SUMMARY */}
<div className="mt-3 space-y-1 text-sm">

  <div className="flex justify-between">
    <span>Subtotal</span>
    <span>₹ {subtotal}</span>
  </div>

  <div className="flex justify-between text-green-600">
    <span>Discount</span>
    <span>- ₹ {totalDiscount}</span>
  </div>

  <div className="flex justify-between">
    <span>Delivery Charge</span>
    <span>₹ {deliveryCharge}</span>
  </div>

  <div className="flex justify-between">
    <span>COD Charge</span>
    <span>₹ {codCharge}</span>
  </div>

  <hr />

  <div className="flex justify-between font-bold">
    <span>Total Payable</span>
    <span>₹ {total}</span>
  </div>

</div>
      {/* PAYMENT */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="font-bold mb-3">
          Payment Method
        </h2>

        <p className="text-gray-500">
          Secure payment via Razorpay 💳
        </p>
      </div>

      {/* PAY BUTTON */}
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