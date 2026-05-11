

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addToCart,removeFromCart,setCart } from "../../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/wishlistSlice";

import { useMemo } from "react";


function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // 🔥 Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCart = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 IMPORTANT: format _id
    const formatted = res.data.map((item) => ({
      ...item,
      _id: item.product_id,
    }));

    dispatch(setCart(formatted));

  } catch (err) {
    console.log(err);
  }
};

  const handleAddToCart = async (product) => {
  try {
    const token = localStorage.getItem("token");

    // ✅ 1. Save in DB
    await API.post("/cart", product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ 2. Update Redux (UI instantly)
    dispatch(addToCart(product));

    console.log("Added to DB + Redux");

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

const handleRemoveFromCart = async (product) => {
  try {
    const token = localStorage.getItem("token");

    await API.delete("/cart", {
      data: { product_id: product._id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(removeFromCart(String(product._id)));

  } catch (err) {
    console.log(err);
  }
};

const handleWishlist = async (product) => {
  const token = localStorage.getItem("token");

  await API.post(
    "/wishlist/toggle",
    { product_id: product._id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  await fetchWishlist(); // refresh UI
};
const fetchWishlist = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setWishlist(res.data);
  } catch (err) {
    console.log(err);
  }
};



  useEffect(() => {
    fetchProducts();
    fetchWishlist();
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/user_dashboard")}
        className="flex items-center gap-2 mb-4 text-blue-500 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

{products.map((product) => {

 const isInWishlist = wishlist.some((item) =>
  item.product_id === product._id ||
  item.product?.id === product._id
);
const isInCart = cartItems.some(
  (item) => String(item._id) === String(product._id)
);
  return (
    <div
      key={product._id}
      className="bg-white rounded-xl shadow p-4"
    >

      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        className="h-40 w-full object-cover rounded-lg mb-3"
      />

      <h2 className="font-semibold text-lg">
        {product.name}
      </h2>

      <p className="text-gray-500 mb-2">
        ₹ {product.price}
      </p>

      {/* 🛒 Cart */}
    <button
  onClick={() => {
    const id = String(product._id);

    if (isInCart) {
    handleRemoveFromCart(product);  // 🔥 remove from DB + Redux
  } else {
    handleAddToCart(product);
  }
  }}
  className={`w-full py-2 rounded-lg mb-2 text-white ${
    isInCart
      ? "bg-red-500 hover:bg-red-600"
      : "bg-blue-500 hover:bg-blue-600"
  }`}
>
  {isInCart ? "Remove from Cart ❌" : "Add to Cart 🛒"}
</button>

      {/* ❤️ Wishlist */}
<button
  onClick={() => handleWishlist(product)}
  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white ${
    isInWishlist ? "bg-red-500" : "bg-blue-500"
  }`}
>
  ❤️ {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
</button>
    </div>
  );
})}

      </div>
    </div>
  );
}

export default Products;