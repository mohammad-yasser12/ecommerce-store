import { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH ORDERS
 const fetchOrders = async (userId = "", sortValue = "", pageNumber = 1) => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await API.get(
      `/admin/orders?user_id=${userId}&sort=${sortValue}&page=${pageNumber}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   setOrders(res.data.orders || []);
setTotalPages(res.data.pages || 1);
setPage(res.data.page || 1);

  } catch (err) {
    console.log(err);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};
  // 🔥 AUTO FETCH
  useEffect(() => {
    fetchOrders(searchUser, sort, page);
  }, [searchUser, sort, page]);

  return (
    <div className="p-6">

      {/* BACK */}
      <button
        onClick={() => window.history.back()}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">

        <input
          type="text"
          placeholder="Search by User ID..."
          value={searchUser}
          onChange={(e) => {
            setSearchUser(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded-md w-1/3"
        />

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded-md ml-3"
        >
          <option value="">Sort By</option>
          <option value="total_asc">Price Low → High</option>
          <option value="total_desc">Price High → Low</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        {loading ? (
          <p className="p-4 text-gray-500">Loading orders...</p>
        ) : (
          <table className="w-full text-left">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {(orders || []).length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                (orders || []).map((order) => (
                  <tr key={order._id} className="border-b">

                    <td className="p-3">
                      {order._id.slice(0, 8)}...
                    </td>

                    <td className="p-3">
                      {order.user_id}
                    </td>

                    <td className="p-3">
                      {order.items.length} items
                    </td>

                    <td className="p-3 font-semibold">
                      ₹ {order.total}
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-4">

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1 bg-blue-500 text-white rounded">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default AdminOrders;