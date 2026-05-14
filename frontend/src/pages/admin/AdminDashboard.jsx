import { FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { FaBox, FaUsers, FaShoppingCart } from "react-icons/fa";
import { FaTag } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [brand, setBrand] = useState("");
  const [wishlistStats, setWishlistStats] = useState([]);
const [totalUsers, setTotalUsers] = useState(0);
const [totalOrders, setTotalOrders] = useState(0);
  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (err) {
      alert("Error fetching products");
    }
  };
const fetchUsers = async () => {
  try {
    const res = await API.get("/users");

    const data = res.data;

    // ✅ handle both API formats safely
    setUsers(Array.isArray(data) ? data : data.users || []);
       setTotalUsers(res.data.total); 
  } catch (err) {
    console.log("Error fetching users", err);
    setUsers([]); // fallback safety
  }
};

  const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrders(res.data);
    setTotalOrders(res.data.total || 0);
  } catch (err) {
    console.log(err);
  }
};

const fetchWishlistStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/admin/wishlist-stats", {
      headers: {
        Authorization: `Bearer ${token}`,   // ✅ VERY IMPORTANT
      },
    });

    setWishlistStats(res.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
useEffect(() => {
  fetchWishlistStats();
}, []);

  useEffect(() => {
    fetchProducts();
    fetchUsers();   // 🔥 add this
    fetchOrders();  // 🔥 add this
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("brand", brand);

    try {
      await API.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Product added");
      setShowModal(false);

    } catch (err) {
      alert("Error adding product");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
     <div className="w-64 bg-white shadow-lg p-5">
  <h2 className="text-xl font-bold mb-6 text-blue-600">
    Admin Panel
  </h2>

  <ul className="space-y-4">
    <li className="flex items-center gap-2 cursor-pointer hover:text-blue-500 hover:bg-blue-50 hover:translate-x-2 transition-all duration-300 p-2 rounded-lg">
      <MdDashboard /> Dashboard
    </li>

    <li
      onClick={() => navigate("/admin_products")}
      className="flex items-center gap-2 cursor-pointer hover:text-blue-500 hover:bg-blue-50 hover:translate-x-2 transition-all duration-300 p-2 rounded-lg"
    >
      <FaBox /> Products
    </li>

    <li
      onClick={() => navigate("/admin/orders")}
      className="flex items-center gap-2 cursor-pointer hover:text-blue-500 hover:bg-blue-50 hover:translate-x-2 transition-all duration-300 p-2 rounded-lg"
    >
      <FaShoppingCart /> Orders
    </li>

    <li
      onClick={() => navigate("/admin_users")}
      className="flex items-center gap-2 cursor-pointer hover:text-blue-500 hover:bg-blue-50 hover:translate-x-2 transition-all duration-300 p-2 rounded-lg"
    >
      <FaUsers /> Users
    </li>
  </ul>
</div>
      {/* Main Content */}
      <div className="flex-1">

        {/* Top Navbar */}
       <div className="flex justify-end p-4 bg-white shadow gap-3">
  
  <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transform hover:-translate-y-1 hover:scale-105 hover:bg-blue-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
  >
    <FaPlus className="text-sm" />
  </button>
  <button
    onClick={() => navigate("/admin/promotions")}
    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transform hover:-translate-y-1 hover:scale-105 hover:bg-green-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
  >
    <FaTag className="text-sm" />
  </button>

  <button
    onClick={() => dispatch(logout())}
    className="p-2 rounded-full hover:bg-red-100 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    title="Logout"
  >
    <FiLogOut className="text-red-500 text-xl" />
  </button>

</div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">

              <h2 className="text-xl font-bold mb-4">Add Product</h2>

              {/* Form */}
              <form onSubmit={handleAddProduct} className="flex flex-col gap-3">

                <input
                  type="text"
                  placeholder="Product Name"
                  className="p-2 border rounded"
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                
                <input
  type="text"
  placeholder="Brand"
  value={brand}
  onChange={(e) => setBrand(e.target.value)}
  className="border p-2 rounded"
/> 

                <input
                  type="number"
                  placeholder="Price"
                  className="p-2 border rounded"
                  onChange={(e) => setPrice(e.target.value)}
                />

                <textarea
                  placeholder="Description"
                  className="p-2 border rounded"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="p-2 border rounded"
                  onChange={(e) => setCategory(e.target.value)}
                />

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-3">

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {/* Stats Cards */}
 <div className="grid grid-cols-3 gap-6">
  <div 
      onClick={() => navigate("/admin_products")}
  className="bg-white p-5 rounded-xl shadow transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer">
    <h2 className="text-gray-500">Total Products</h2>
    <p className="text-2xl font-bold">{products.length}</p>
  </div>

  <div
    onClick={() => navigate("/admin/orders")}
   className="bg-white p-5 rounded-xl shadow transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer">
    <h2 className="text-gray-500">Total Orders</h2>
    <p className="text-2xl font-bold">{totalOrders}</p>
  </div>

  <div
       onClick={() => navigate("/admin_users")}
    className="bg-white p-5 rounded-xl shadow transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
  >
    <h2 className="text-gray-500">Users</h2>
    <p className="text-2xl font-bold">
       {totalUsers}
    </p>
  </div>

 <div
  onClick={() => navigate("/admin/wishlist-stats")}
  className="bg-white p-5 rounded-xl shadow transform hover:-translate-y-2 hover:shadow-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
>
  <h2 className="text-gray-500 mb-2">Top Wishlisted</h2>

  <p className="text-sm font-semibold">
    ❤️ View Wishlist Analytics
  </p>
</div>
</div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;