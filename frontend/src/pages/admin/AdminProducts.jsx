import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";



function AdminProducts() {
  const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
const [sort, setSort] = useState("");
const [categories, setCategories] = useState([]);
const [editProduct, setEditProduct] = useState(null);
const [openMenu, setOpenMenu] = useState(null);
const [formData, setFormData] = useState({});


    const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // 🔥 Fetch products
 const fetchProducts = async () => {
  try {
    const res = await API.get(
      `/products?search=${search}&category=${category}&sort=${sort}`
    );

    setProducts(res.data);
  } catch (err) {
    console.log("Error fetching products");
  }
};

const fetchCategories = async () => {
  try {
    const res = await API.get("/products/categories");
    setCategories(res.data);
  } catch (err) {
    console.log(err);
  }
};

const handleDelete = async (id) => {
  try {
    await API.delete(`/admin/product/${id}`);

    setProducts((prev) => prev.filter((p) => p._id !== id));
  } catch (err) {
    console.log("Delete failed");
  }
};

const handleUpdate = async () => {
  try {
    const res = await API.put(
      `/admin/product/${editProduct._id}`,
      formData
    );

    setProducts((prev) =>
      prev.map((p) =>
        p._id === editProduct._id ? res.data : p
      )
    );

    setEditProduct(null);
  } catch (err) {
    console.log("Update failed");
  }
};

const openEdit = (product) => {
  setEditProduct(product); // ONLY ONE PRODUCT
  setFormData({
    name: product.name,
    brand: product.brand,
    price: product.price,
    description: product.description,
    category: product.category, 
  });
};

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, category, sort]);

  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-gray-700 hover:text-blue-500 mb-4"
>
  <IoArrowBack className="text-xl" />
  Back
</button>
      
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        All Products
      </h1>

      {/* Grid */}
      <div className="flex gap-4 mb-6 flex-wrap">

  {/* Search */}
  <input
    type="text"
    placeholder="Search product..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded-lg"
  />
  

  {/* Category */}
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="border p-2 rounded-lg"
  >
    <option value="">All Categories</option>
    {categories.map((cat, i) => (
      <option key={i} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  {/* Sort */}
  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="border p-2 rounded-lg"
  >
    <option value="">Sort</option>
    <option value="price_asc">Low → High</option>
    <option value="price_desc">High → Low</option>
  </select>
<button
  onClick={() => {
    setSearch("");
    setCategory("");
    setSort("");
  }}
  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg
             shadow-md hover:bg-red-600 hover:shadow-xl
             hover:-translate-y-1 active:scale-95 transition-all duration-300"
>
  🧹 Clear 
</button>
</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

  {products.map((product) => (
    <div
      key={product._id}
      className="relative bg-white rounded-xl shadow p-4 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
    >

      {/* 🔥 TOP RIGHT MENU */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() =>
            setOpenMenu(openMenu === product._id ? null : product._id)
          }
          className="text-2xl font-bold px-2"
        >
          ⋮
        </button>

        {openMenu === product._id && (
          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md overflow-hidden z-10">

            <button
              onClick={() => {
                openEdit(product);
                setOpenMenu(null);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              ✏️ Edit
            </button>

            <button
              onClick={() => {
                handleDelete(product._id);
                setOpenMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100"
            >
              🗑️ Delete
            </button>

          </div>
        )}

      </div>

      {/* IMAGE */}
      <div className="overflow-hidden rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h2>

        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className="h-40 w-full object-contain bg-gray-100 rounded-lg mb-3 transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* BRAND */}
      <h4 className="text-ml font-semibold text-gray-800">
        {product.brand}
      </h4>

      {/* PRICE */}
      <p className="text-blue-500 font-bold">
        ₹ {product.price}
      </p>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-500 mt-2">
        {product.description}
      </p>

    </div>
  ))}
  {editProduct && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    onClick={() => setEditProduct(null)}
  >
    <div
      className="bg-white p-6 rounded-lg w-96"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <input
        className="border p-2 w-full mb-2"
        value={formData.name || ""}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        placeholder="Name"
      />

      <input
        className="border p-2 w-full mb-2"
        value={formData.brand || ""}
        onChange={(e) =>
          setFormData({ ...formData, brand: e.target.value })
        }
        placeholder="Brand"
      />

      <input
  className="border p-2 w-full mb-2"
  value={formData.category || ""}
  onChange={(e) =>
    setFormData({ ...formData, category: e.target.value })
  }
  placeholder="Category"
/>

      <input
        className="border p-2 w-full mb-2"
        value={formData.price || ""}
        onChange={(e) =>
          setFormData({ ...formData, price: e.target.value })
        }
        placeholder="Price"
      />

      <textarea
        className="border p-2 w-full mb-2"
        value={formData.description || ""}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Description"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setEditProduct(null)}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

</div>
    </div>
  );
}

export default AdminProducts;