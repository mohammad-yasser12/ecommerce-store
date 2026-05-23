

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
  const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
const [categories, setCategories] = useState([]);
const [promotions, setPromotions] = useState([]);
const [sort, setSort] = useState("");
const [zoomImage, setZoomImage] = useState(null);
  const cartItems = useSelector((state) => state.cart.cartItems);
      const uniqueCategories = [...new Set(categories)];



  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // 🔥 Fetch products
  const fetchProducts = async () => {
    try {
     const res = await API.get(
  `/products?search=${search}&category=${category}&sort=${sort}`
);
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

const fetchCategories = async () => {

  try {

    const res = await API.get("/products/categories");

    setCategories(res.data);
    console.log("CATEGORIES FROM API:", res.data);

  } catch (err) {
    console.log(err);
  }
};



  useEffect(() => {
    fetchProducts();
    fetchWishlist();
     fetchCategories();
    fetchCart();
  }, [search, category, sort]);

  useEffect(() => {
  API.get("/promotions")
    .then(res => setPromotions(res.data))
    .catch(err => console.log(err));
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
  <div className="flex gap-3 overflow-x-auto">

  {promotions.map((p) => (
    <div
      key={p._id}
      className="min-w-[140px] bg-yellow-100 p-3 rounded-xl shadow flex flex-col justify-between"
    >
      <div>
        <h2 className="font-bold text-sm">{p.title}</h2>

        <p className="text-green-600 font-bold text-lg mt-1">
          {p.type === "percentage"
            ? `${p.value}% OFF`
            : `₹${p.value} OFF`}
        </p>
      </div>

      <button
        onClick={() => navigate("/offers")}
        className="mt-3 bg-black text-white text-xs px-2 py-1 rounded"
      >
        Shop Now
      </button>
    </div>
  ))}

</div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">

  {/* SEARCH */}
  <input
    type="text"
    placeholder="Search by brand or product..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-3 rounded-lg w-full"
  />

  {/* CATEGORY */}
  <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="border p-3 rounded-lg"
>

  <option value="">All Categories</option>

 {uniqueCategories.map((cat, index) => (
  <option key={index} value={cat}>
    {cat}
  </option>
))}

</select>
  {/* SORT */}
 <select
  value={sort}
  onChange={(e) => setSort(e.target.value)}
  className="border p-3 rounded-lg"
>
  <option value="">Sort</option>

  <option value="price_asc">Price: Low → High</option>
  <option value="price_desc">Price: High → Low</option>

</select>

</div>

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
       
  <h2 className="font-semibold text-lg">
        {product.name}
      </h2>
     <img
  src={`http://localhost:5000${product.image}`}
  alt={product.name}
onClick={() => setZoomImage(product)}
  className="h-40 w-full object-cover rounded-lg mb-3 cursor-pointer hover:scale-105 transition"
/>

  <h2 className="font-semibold text-lg">
        {product.brand}
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
{zoomImage && (
  <div
    onClick={() => setZoomImage(null)}
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
  >
    <img
      src={`http://localhost:5000${zoomImage.image}`}
      alt={zoomImage.name}
      className="max-w-[90%] max-h-[90%] rounded-2xl animate-zoomIn"
    />
  </div>
)}

      </div>
    </div>
  );
}

export default Products;