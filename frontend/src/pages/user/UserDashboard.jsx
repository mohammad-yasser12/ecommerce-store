import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import API from "../../api/axios";

function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const dispatch = useDispatch();
const navigate = useNavigate();
const cartItems = useSelector((state) => state.cart.cartItems);
// const wishlistItems = useSelector((state) => state.wishlist.items);

const handleLogout = () => {
  // 🔥 clear token
  localStorage.removeItem("token");

  // 🔥 clear redux
  dispatch(logout());

  // 🔥 redirect
  navigate("/");
};

const fetchWishlist = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setWishlistItems(res.data);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchWishlist();
}, []);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  fetchOrders();
}, []);

  return (
    <div className="min-h-screen bg-gray-100">
      

      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 bg-white shadow">
        
        {/* Left */}
        <div className="flex items-center gap-2">
          <MdDashboard className="text-blue-500 text-xl" />
          <h1 className="font-bold text-lg">User Dashboard</h1>
        </div>

        {/* Right */}
       <button
  onClick={handleLogout}
  className="p-2 rounded-full hover:bg-red-100 cursor-pointer"
  title="Logout"
>
  <FiLogOut className="text-red-500 text-xl" />
</button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome 👋
        </h2>

      <div className="grid grid-cols-2 gap-6">

  {/* ORDERS CARD */}
  <div className="bg-white p-5 rounded-xl shadow 
    transform transition-all duration-300 ease-out
    hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:z-10">
    
    <h3 className="text-gray-500">My Orders</h3>
    <p className="text-2xl font-bold">{orders.length}</p>
  </div>

  {/* WISHLIST CARD */}
  <div className="bg-white p-5 rounded-xl shadow 
    transform transition-all duration-300 ease-out
    hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:z-10">

    <h3 className="text-gray-500">Wishlist</h3>
    <p className="text-2xl font-bold">{wishlistItems.length}</p>
  </div>

</div>
      </div>
    <div className="grid grid-cols-2 gap-6 mt-6">

  {/* PRODUCTS */}
  <div
    onClick={() => navigate("/products")}
    className="group cursor-pointer bg-white rounded-2xl p-6 shadow 
    transform transition-all duration-200 ease-out
    hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.03] hover:z-10"
  >
    <div className="text-2xl mb-3 group-hover:scale-80 transition">
      🛍️
    </div>
    <h3 className="text-lg font-semibold">Browse Products</h3>
    <p className="text-sm text-gray-500 mt-1">
      Explore latest items and collections
    </p>
  </div>

  {/* CART */}
  <div
    onClick={() => navigate("/cart")}
    className="group cursor-pointer bg-white rounded-2xl p-6 shadow 
    transform transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.03] hover:z-8"
  >
    <div className="text-3xl mb-3 group-hover:scale-80 transition">
      🛒
    </div>
    <h3 className="text-lg font-semibold">View Cart</h3>
    <p className="text-sm text-gray-500 mt-1">
      Check selected products
    </p>
  </div>

  {/* ORDERS */}
  <div
    onClick={() => navigate("/orders")}
    className="group cursor-pointer bg-white rounded-2xl p-6 shadow 
    transform transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.03] hover:z-10"
  >
    <div className="text-3xl mb-3 group-hover:scale-80 transition">
      📦
    </div>
    <h3 className="text-lg font-semibold">My Orders</h3>
    <p className="text-sm text-gray-500 mt-1">
      Track your purchases
    </p>
  </div>

</div>
    </div>
  );
}

export default UserDashboard;