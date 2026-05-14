import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

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

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome Back 👋
      </h1>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

{products.map((p) => (
  <div key={p._id} className="bg-white p-4 rounded-ml shadow">

    <img
      src={`http://localhost:5000${p.product.image}`}
      className="w-100 h-40 object-cover rounded"
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
        onClick={() =>
          navigate("/checkout", {
            state: { product: p.product },
          })
        }
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Buy Now
      </button>

    </div>

  </div>
))}

{selectedProduct && (
  <div
    onClick={() => setSelectedProduct(null)}
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
  >

    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white p-4 rounded-xl max-w-md w-full animate-zoomIn"
    >

      <img
        src={`http://localhost:5000${selectedProduct.image}`}
        className="w-full h-100 object-cover rounded-lg"
          
      />

      <h2 className="text-xl font-bold mt-3">
        {selectedProduct.name}
      </h2>

      <p className="text-gray-600">
        ₹ {selectedProduct.price}
      </p>

    </div>
  </div>
)}
      </div>

    </div>
  );
}

export default UserHome;