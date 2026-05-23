import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import CategoryNavbar from "../../components/CategoryNavbar";

function UserHome() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
     const res = await API.get("/promotions");
setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

   useEffect(() => {
    API.get("/promotions")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.log(err));
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <button onClick={() => navigate("/products")} className="mb-4 text-blue-500 hover:underline">
          back
        </button>
         <div>
      <CategoryNavbar />

      {/* Rest of page */}
    </div>

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome Back 👋
      </h1>

      {/* PRODUCTS */}
<div className="overflow-x-auto scrollbar-hide">
  <div className="flex gap-6 px-2 py-4 snap-x snap-mandatory">
    
    {products.map((p) => (
      <div
        key={p._id}
        className="min-w-[220px] bg-white p-4 rounded-lg shadow snap-start flex-shrink-0"
      >
        <img
          src={`http://localhost:5000${p.product.image}`}
          className="w-full h-40 object-cover rounded cursor-pointer"
          onClick={() => setSelectedProduct(p.product)}
        />

        <h2 className="font-bold mt-2">
          {p.product.name}
        </h2>

        <p className="text-green-600 font-bold">
          🎁 {p.title} - {p.discount}% OFF
        </p>

        <p className="text-gray-500 line-through">
          ₹ {p.product.price}
        </p>

        <p className="text-black font-bold">
          ₹ {p.product.price - (p.product.price * p.discount / 100)}
        </p>

        <div className="flex gap-2 mt-3">
          
          <button
            onClick={() => setSelectedProduct(p.product)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            View
          </button>

                <button 
  onClick={() => {
    navigate("/checkout", {
      state: { productId: p.product._id },
    });
  }}
   className="bg-green-500 text-white px-3 py-1 rounded"
>
  Buy now
</button>

        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}

export default UserHome;