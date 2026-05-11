import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, decreaseQuantity } from "../../redux/cartSlice";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Cart() {
    const [cart, setCart] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 💰 Total price
    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

   const handleIncrease = async (item) => {
  try {
    const token = localStorage.getItem("token");

    await API.post("/cart", item, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchCartFromBackend(); // 🔥 refresh UI
  } catch (err) {
    console.log(err);
  }
};

   const handleDecrease = async (item) => {
  try {
    const token = localStorage.getItem("token");

    await API.put(
      "/cart/decrease",
      { product_id: item._id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await fetchCartFromBackend(); // 🔥
  } catch (err) {
    console.log(err);
  }
};

const handleRemove = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await API.delete("/cart", {
      data: { product_id: id },
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchCartFromBackend(); // 🔥 FIX HERE
  } catch (err) {
    console.log(err);
  }
};
    const fetchCartFromBackend = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const formattedCart = res.data.map((item) => ({
      ...item,
      _id: item.product_id,
    }));

    setCart(formattedCart); // ✅ useState
  } catch (err) {
    console.log(err);
  }
};

    useEffect(() => {
        fetchCartFromBackend();
    }, []);
    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* 🔙 Back */}
            <button
                onClick={() => navigate("/products")}
                className="mb-4 text-blue-500 hover:underline"
            >
                ← Back to Products
            </button>

            <h1 className="text-2xl font-bold mb-6">My Cart 🛒</h1>

            {cart.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
            ) : (
                <div className="space-y-4">

                    {cart.map((item) => (

                        <div
                            key={item._id}
                            className="bg-white p-4 rounded-xl shadow flex items-center gap-4"
                        >
                            {/* Image */}
                            <img
                                src={`http://localhost:5000${item.image}`}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />

                            {/* Info */}
                            <div className="flex-1">
                                <h2 className="font-semibold">{item.name}</h2>
                                <p className="text-gray-500">₹ {item.price}</p>

                                {/* Quantity */}
                                <div className="flex items-center gap-3 mt-2">

                                    {/* ➖ Minus */}
                                    <button
                                        onClick={() => handleDecrease(item)}
                                        className="px-2 bg-gray-200 rounded"
                                    >
                                        -
                                    </button>

                                    {/* Quantity */}
                                    <span>{item.quantity}</span>

                                    {/* ➕ Plus */}
                                    <button
                                        onClick={() => handleIncrease(item)}
                                        className="px-2 bg-gray-200 rounded"
                                    >
                                        +
                                    </button>

                                    {/* ❌ Remove completely */}
                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="px-2 bg-red-200 rounded"
                                    >
                                        ❌
                                    </button>

                                </div>
                            </div>

                            {/* Subtotal */}
                            <p className="font-bold">
                                ₹ {item.price * item.quantity}
                            </p>
                        </div>
                    ))}

                    {/* Total */}
                    <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                        <h2 className="text-lg font-bold">Total</h2>
                        <p className="text-xl font-bold">₹ {total}</p>
                    </div>

                    {/* Checkout */}
                    <button
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                    >
                        Proceed to Checkout 💳
                    </button>

                </div>
            )}
        </div>
    );
}

export default Cart;