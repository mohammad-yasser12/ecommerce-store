import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import API from "../../api/axios";

import { addToCart, removeFromCart } from "../../redux/cartSlice";

function CategoryPage() {
  const { categoryName } = useParams();

  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    API.get(`/products/category/${categoryName}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryName]);

  const handleRemoveFromCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete("/cart", {
        data: { product_id: product._id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(removeFromCart(String(product._id)));

    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      await API.post("/cart", product, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(addToCart(product));

      console.log("Added to DB + Redux");

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="p-5">

      <button
        onClick={() => window.history.back()}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {categoryName}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((product) => {

            const isInCart = cartItems.some(
              (item) => String(item._id) === String(product._id)
            );

            return (
              <div
                key={product._id}
                className="border rounded-lg p-4 shadow"
              >

                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded"
                />

                <h2 className="text-lg font-semibold mt-3">
                  {product.name}
                </h2>

                <h2 className="text-lg font-semibold mt-3">
                  {product.brand}
                </h2>

                <p className="text-gray-600 mt-1">
                  ₹{product.price}
                </p>

                <button
                  onClick={() => {
                    if (isInCart) {
                      handleRemoveFromCart(product);
                    } else {
                      handleAddToCart(product);
                    }
                  }}
                  className={`w-full py-2 rounded-lg mb-2 text-white ${
                    isInCart
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isInCart
                    ? "Remove from Cart ❌"
                    : "Add to Cart 🛒"}
                </button>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default CategoryPage;