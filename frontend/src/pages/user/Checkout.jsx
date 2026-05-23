import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState,useMemo} from "react";  
import API from "../../api/axios";

function Checkout() {
   const location = useLocation();
 const [checkoutItems, setCheckoutItems] = useState(
  location.state?.checkoutItems || []
);



  const navigate = useNavigate();
 
const checkoutItemsFromCart = location.state?.checkoutItems || [];
console.log("Checkout items from location:", checkoutItemsFromCart);
  // Buy Now product OR cart
  const buyNowProduct = location.state?.product;
  const productId = location.state?.productId;


const product_price = useMemo(() => {
  if (!checkoutItems.length) return 0;

  return checkoutItems.reduce((acc, item) => {
    const product = item?.product || item;
    const price = product?.price ?? 0;
    const qty = item?.quantity ?? 1;

    return acc + price * qty;
  }, 0);
}, [checkoutItems]);

console.log("Product price123:", product_price);
const promotionDiscount = useMemo(() => {
  return (checkoutItems || []).reduce((acc, item) => {
    const product = item?.product || item;
    const discount = product?.discount ?? 0;
    const qty = item?.quantity ?? 1;

    return acc + discount * qty;
  }, 0);
}, [checkoutItems]);

const codCharge = 0;

const deliveryCharge =  
  product_price < 2000
    ? 40
    : product_price < 10000
    ? 20
    : 0;

const subtotal = product_price+deliveryCharge ;

const total = useMemo(() => {
  return product_price - promotionDiscount + deliveryCharge;
}, [product_price, promotionDiscount, deliveryCharge]);





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

useEffect(() => {
  if (productId) {
    API.get(`/checkout/product/${productId}`).then(res => {
      setCheckoutItems([{ product: res.data, quantity: 1 }]);
    });
  }

  else if (checkoutItemsFromCart) {
    setCheckoutItems(checkoutItemsFromCart);
  }
}, []);

useEffect(() => {
  const cartItems = location.state?.checkoutItems;
  const buyNowProduct = location.state?.product;

  if (buyNowProduct) {
    setCheckoutItems([{ product: buyNowProduct, quantity: 1 }]);
  } 
  else if (cartItems?.length > 0) {
    setCheckoutItems(cartItems);
  }
}, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
<button
  onClick={() => navigate(-1)}
  className="mb-4 text-blue-500 hover:underline"
>
  ← Back
</button>

      <h1 className="text-2xl font-bold mb-6">Checkout 💳</h1>

      {/* SUMMARY */}
<div className="bg-white p-4 rounded-xl shadow space-y-2 text-sm">
  <div className="flex justify-between">

    
    <span>Product Price</span>
    <span>₹ {product_price}</span>
  </div>

   <div className="flex justify-between">
    <span>Delivery</span>
    <span>₹ {deliveryCharge}</span>
  </div>

  <div className="flex justify-between font-bold text-ml">
   

    <span>Subtotal</span>
    <span>₹ {subtotal}</span>
  </div>


 

  <div className="flex justify-between">
    <span>Promotion Discount</span>
    <span>₹ {promotionDiscount}</span>
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