import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaBan } from "react-icons/fa";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
const [showModal, setShowModal] = useState(false);
const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const showPrev = currentPage > 1;
const showNext = currentPage < totalPages;

  // 🔥 Fetch users
const fetchUsers = async (page = 1) => {
  try {
    const res = await API.get(`/users?page=${page}&limit=10`);

    setUsers(res.data.users || []);
    setTotalPages(res.data.pages || 1);
    setCurrentPage(page);

  } catch (err) {
    console.log("Error fetching users", err);
    setUsers([]);
  }
};

  const deleteUser = async (id, role) => {
  try {
    await API.delete(`/user/${id}`);

    // 🔥 refresh users after delete
    setUsers((prev) => prev.filter((u) => u._id !== id));

  } catch (err) {
    console.log(err);
    alert("Delete failed");
  }
};

const blockUser = async (id) => {
  try {
    await API.patch(`/user/block/${id}`);

    // refresh users
    fetchUsers();
  } catch (err) {
    console.log(err);
  }
};

const filteredUsers = users.filter((user) =>
  user.username.toLowerCase().includes(search.toLowerCase()) ||
  user.email.toLowerCase().includes(search.toLowerCase())
);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);
  useEffect(() => {
  fetchUsers(currentPage);
}, [currentPage,search]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        
        <button
          onClick={() => navigate("/admin_dashboard")}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
        >
          <IoArrowBack className="text-xl" />
          Back
        </button>

        <h1 className="text-xl font-bold">Users</h1>

      </div>

      {/* Table */}
<div className="bg-white rounded-xl shadow overflow-hidden">

  <h3 className="p-4 font-semibold">Users</h3>

  {/* SEARCH INPUT */}
  <div className="px-4 pb-4">
    <input
      type="text"
      placeholder="Search by username or email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border p-2 rounded-md w-1/3"
    />
  </div>

  <table className="w-full text-left">

    <thead className="bg-gray-200">
      <tr>
        <th className="p-3">Username</th>
        <th className="p-3">Email</th>
        <th className="p-3">Role</th>
        <th className="p-3">Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredUsers.map((user) => (
        <tr key={user._id} className="border-b hover:bg-gray-50">

          <td className="p-3">{user.username}</td>
          <td className="p-3">{user.email}</td>

          <td className="p-3">
            <span className={`px-2 py-1 rounded text-sm ${
              user.isBlocked
                ? "bg-gray-300 text-gray-700"
                : user.role === "admin"
                ? "bg-red-100 text-red-500"
                : "bg-green-100 text-green-500"
            }`}>
              {user.isBlocked ? "Blocked" : user.role}
            </span>
          </td>

          <td className="p-3">
            <button
              className="cursor-pointer text-3xl"
              onClick={() => {
                setSelectedUser(user);
                setShowModal(true);
              }}
            >
              ⋮
            </button>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
 
</div>
<div className="flex justify-center gap-2 mt-4">

  {showPrev && (
    <button onClick={() => setCurrentPage(currentPage - 1)}>
      Prev
    </button>
  )}

  <span className="px-3 py-1 bg-blue-500 text-white rounded">
    {currentPage}
  </span>

  {showNext && (
    <button onClick={() => setCurrentPage(currentPage + 1)}>
      Next
    </button>
  )}

</div>
      {showModal && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    {/* Modal Box */}
    <div className="bg-white rounded-xl p-6 w-80 shadow-lg">

      <h2 className="text-lg font-semibold mb-4">
        User Actions
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        {selectedUser.username}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-2">

        {/* Edit */}
        {/* <button
          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
          onClick={() => {
            console.log("Edit", selectedUser._id);
            setShowModal(false);
          }}
        >
          ✏️ Edit
        </button> */}

        {/* Block */}
  <button
  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
  onClick={() => {
    blockUser(selectedUser._id);
    setShowModal(false);
  }}
>
  🚫 {selectedUser.isBlocked ? "Unblock" : "Block"}
</button>

        {/* Delete */}
 {selectedUser.role !== "admin" && (
  <button
    className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-100 rounded"
    onClick={() => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;

      deleteUser(selectedUser._id, selectedUser.role);
      setShowModal(false);
    }}
  >
    ❌ Delete
  </button>
)}

      </div>

      {/* Close */}
      <button
        onClick={() => setShowModal(false)}
        className="mt-4 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
      >
        Cancel
      </button>

    </div>
  </div>
)}
      

    </div>
  );
}

export default AdminUsers;