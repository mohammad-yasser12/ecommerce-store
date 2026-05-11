import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";



function AdminProducts() {
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // 🔥 Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <div
      key={product._id}
      className="bg-white rounded-xl shadow p-4 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className="h-40 w-full object-contain bg-gray-100 rounded-lg mb-3 transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Name */}
      <h2 className="text-lg font-semibold text-gray-800">
        {product.name}
      </h2>

      {/* Price */}
      <p className="text-blue-500 font-bold">
        ₹ {product.price}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-2">
        {product.description}
      </p>
    </div>
  ))}
</div>
    </div>
  );
}

export default AdminProducts;