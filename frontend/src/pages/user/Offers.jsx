import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Offers() {
  const [promotions, setPromotions] = useState([]);
   const [products, setProducts] = useState([]);
  const navigate = useNavigate();

    const fetchProducts = async () => {
    try {
     const res = await API.get(
  `/products?search=${search}&category=${category}&sort=${sort}`
);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
    const handleAddToCart = async (product) => {
  try {
    const token = localStorage.getItem("token");

    // ✅ 1. Save in DB
    await API.post("/cart", product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ 2. Update Redux (UI instantly)
    dispatch(addToCart(product));

    console.log("Added to DB + Redux");

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

// const handleRemoveFromCart = async (product) => {
//   try {
//     const token = localStorage.getItem("token");

//     await API.delete("/cart", {
//       data: { product_id: product._id },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     dispatch(removeFromCart(String(product._id)));

//   } catch (err) {
//     console.log(err);
//   }
// };

  useEffect(() => {
    API.get("/promotions")
      .then((res) => setPromotions(res.data || []))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* BACK */}
      <button
        onClick={() => navigate("/products")}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        🎉 Special Offers
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {promotions.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
          >

            {/* PRODUCT IMAGE */}
            <img
              src={`http://localhost:5000${p.product?.image}`}
              alt={p.product?.name}
              className="h-48 w-full object-contain bg-gray-100"
            />

            <div className="p-4">

              {/* TITLE */}
              <h2 className="text-xl font-semibold">
                {p.title}
              </h2>

              {/* PRODUCT NAME */}
              <p className="text-gray-600">
                {p.product?.name}
              </p>

              {/* DISCOUNT */}
              <p className="text-green-600 font-bold mt-2">
  {p.type === "percentage"
    ? `${p.value}% OFF`
    : `₹${p.value} OFF`}
</p>

              {/* DATES */}
              <p className="text-xs text-gray-400 mt-1">
                {p.start_date} → {p.end_date}
              </p>

              {/* BUTTON */}
              {/* <button
                onClick={() => navigate("/products")}
                className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Shop Now
              </button> */}

 <button
                onClick={() => handleAddToCart(p.product)}
                className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add to Cart 🛒
              </button>
           <button 
  onClick={() => {
    navigate("/checkout", {
      state: { productId: p.product._id },
    });
  }}
   className="w-full mt-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
>
  Buy now
</button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Offers;