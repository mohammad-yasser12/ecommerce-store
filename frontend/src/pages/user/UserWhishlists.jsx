import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function UserWishlists() {
  const [wishlists, setWishlists] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlists(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ❌ Remove Wishlist
const removeWishlist = async (productId) => {
  try {
    const token = localStorage.getItem("token");

    await API.delete(`/wishlist/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setWishlists((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <button
          onClick={() => navigate("/user_dashboard")}
          className="mb-4 text-blue-500 hover:underline"
        >
          &larr; Back to Home
        </button>   
      
      <h1 className="text-3xl font-bold mb-6">
        My Wishlist ❤️
      </h1>

      {wishlists.length === 0 ? (
        <p>No wishlist products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {wishlists.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4"
            >
              
              <img
               src={`http://localhost:5000${item.product.image}`}
                alt={item.product.name}
                 onClick={() => setSelectedProduct(item.product)}
                className="w-full h-52 object-cover rounded-lg"
              />

              <h2 className="text-xl font-bold mt-3">
                {item.product.name}
              </h2>

              <p className="text-gray-600 mt-1">
                ₹ {item.product.price}
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col gap-2 mt-4">

               <button
  onClick={() => setSelectedProduct(item.product)}
  className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
>
  View Product
</button>

               {selectedProduct && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-2xl w-[350px] relative animate-scaleIn">

      {/* CLOSE */}
      <button
        onClick={() => setSelectedProduct(null)}
        className="absolute top-2 right-3 text-xl"
      >
        ✕
      </button>

      {/* IMAGE */}
      <img
        src={`http://localhost:5000${selectedProduct.image}`}
        alt={selectedProduct.name}
        className="w-full h-100 object-cover rounded-xl"
      />

      {/* DETAILS */}
      <h2 className="text-2xl font-bold mt-4">
        {selectedProduct.name}
      </h2>

      <p className="text-gray-600 mt-2">
        ₹ {selectedProduct.price}
      </p>

      <button
        onClick={() =>
          navigate("/checkout", {
            state: { product: selectedProduct },
          })
        }
        className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg"
      >
        Buy Now
      </button>

    </div>
  </div>
)}

               <button
  onClick={() => removeWishlist(item.product.id)}
  className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
>
  Remove ❤️
</button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default UserWishlists;