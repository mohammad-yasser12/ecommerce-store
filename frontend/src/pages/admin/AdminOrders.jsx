import { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [sort, setSort] = useState("");

const fetchOrders = async (userId = "", sortValue = "") => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get(
      `/admin/orders?user_id=${userId}&sort=${sortValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setOrders(res.data);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
  order.user_id.toLowerCase().includes(searchUser.toLowerCase())
);

const fetchProducts = async (sortValue = "") => {
  const res = await API.get(`/products?sort=${sortValue}`);
  setProducts(res.data);
};

  return (
    <div className="p-6">
        <button onClick={() => window.history.back()} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
         back
        </button>
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

   <input
  type="text"
  placeholder="Search by User ID..."
  value={searchUser}
  onChange={(e) => {
    setSearchUser(e.target.value);
    fetchOrders(e.target.value, sort);
  }}
  className="border p-2 rounded-md mb-4 w-1/3"
/>
<select
  value={sort}
  onChange={(e) => {
    setSort(e.target.value);
    fetchOrders(searchUser, e.target.value);
  }}
  className="border p-2 rounded-md mb-4 ml-3"
>
  <option value="">Sort By</option>
  <option value="total_asc">Price Low → High</option>
  <option value="total_desc">Price High → Low</option>
</select>
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
            {filteredOrders.map((order) => (
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
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default AdminOrders;