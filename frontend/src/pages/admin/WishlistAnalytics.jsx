import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function WishlistAnalytics() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [activity, setActivity] = useState([]);
    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
const safeActivity = Array.isArray(activity) ? activity : [];

  const fetchStats = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/admin/wishlist-stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setWishlist(res.data);
};

const fetchActivity = async () => {
  const token = localStorage.getItem("token");



  const res = await API.get("/admin/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setActivity(res.data);
};

  useEffect(() => {
   
     fetchStats();
  fetchActivity();
  }, []);

  // 🔥 Unique counts
const uniqueUsers = [
  ...new Set(safeActivity.map(w => w.user?.username))
].length;

const uniqueProducts = [
  ...new Set(safeWishlist.map(w => w.product?.name))
].length;

  // 🔥 Top products calculation
  const topProducts = Object.values(
    safeWishlist.reduce((acc, item) => {
      const name = item.product?.name;
      if (!name) return acc;

      if (!acc[name]) {
        acc[name] = { name, count: 0 };
      }

      acc[name].count += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        ← Back
      </button>

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Wishlist Analytics</h1>

      {/* SUMMARY CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

  <div
    className="bg-white p-5 rounded-xl shadow
    transform transition-all duration-300 ease-out
    hover:-translate-y-3 hover:scale-105 hover:shadow-2xl"
  >
    <h2 className="text-gray-500">Total Wishlist Actions</h2>
    <p className="text-2xl font-bold">{wishlist.length}</p>
  </div>

  <div
    className="bg-white p-5 rounded-xl shadow
    transform transition-all duration-300 ease-out
    hover:-translate-y-3 hover:scale-105 hover:shadow-2xl"
  >
    <h2 className="text-gray-500">Unique Users</h2>
    <p className="text-2xl font-bold">{uniqueUsers}</p>
  </div>

  <div
    className="bg-white p-5 rounded-xl shadow
    transform transition-all duration-300 ease-out
    hover:-translate-y-3 hover:scale-105 hover:shadow-2xl"
  >
    <h2 className="text-gray-500">Unique Products</h2>
    <p className="text-2xl font-bold">{uniqueProducts}</p>
  </div>

</div>

      {/* TOP PRODUCTS */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">

        <h2 className="text-lg font-semibold mb-4">
          Top Wishlisted Products
        </h2>

        {topProducts.length === 0 ? (
          <p className="text-gray-400">No data</p>
        ) : (
          topProducts.map((item, index) => (
            <div
              key={index}
              className="flex justify-between p-2 border-b"
            >
              <span>{item.name}</span>
              <span className="font-bold text-pink-500">
                ❤️ {item.count}
              </span>
            </div>
          ))
        )}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="text-lg font-semibold mb-4">
          Recent Wishlist Activity
        </h2>

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Product</th>
            </tr>
          </thead>

          <tbody>
            {activity.slice(0, 10).map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  {item.user?.username || "Unknown"}
                </td>

                <td className="p-3">
                  {item.product?.name || "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default WishlistAnalytics;