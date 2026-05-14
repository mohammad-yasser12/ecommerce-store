import { useEffect, useState } from "react";
import API from "../../api/axios";
import { IoArrowBack } from "react-icons/io5";

function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
const [productList, setProductList] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "percentage",
    value: "",
    product_id: "",
    start_date: "",
    end_date: "",
  });

  // 🔥 FETCH PROMOTIONS
  const fetchPromotions = async () => {
    try {
      const res = await API.get("/promotions");
      setPromotions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 FETCH PRODUCTS
const fetchProducts = async (query) => {
  try {
    const res = await API.get(`/products?search=${query}`);
    setProductList(res.data || []);
  } catch (err) {
    console.log(err);
  }
};

  // 🔥 CREATE PROMOTION
  const createPromotion = async () => {
    try {
      await API.post("/promotions", formData);

      // reset form
      setFormData({
        title: "",
        type: "percentage",
        value: "",
        product_id: "",
        start_date: "",
        end_date: "",
      });

      fetchPromotions();

      alert("Promotion created successfully 🎉");

    } catch (err) {
      console.log(err);
      alert("Failed to create promotion");
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

 useEffect(() => {
  if (!productSearch) {
    setProductList([]);
    return;
  }

  const delay = setTimeout(() => {
    fetchProducts(productSearch);
  }, 300);

  return () => clearTimeout(delay);
}, [productSearch]);
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* TOP */}
      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
        >
          <IoArrowBack className="text-xl" />
          Back
        </button>

        <h1 className="text-2xl font-bold">
          Promotions
        </h1>

      </div>

      {/* CREATE PROMOTION */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Create Promotion
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* TITLE */}
          <input
            type="text"
            placeholder="Promotion Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          {/* TYPE */}
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          >
            <option value="percentage">
              Percentage Discount
            </option>

            <option value="fixed">
              Fixed Discount
            </option>
          </select>

          {/* VALUE */}
          <input
            type="number"
            placeholder="Discount Value"
            value={formData.value}
            onChange={(e) =>
              setFormData({
                ...formData,
                value: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          {/* PRODUCT */}
         <div className="relative">

<input
  type="text"
  placeholder="Search product..."
  value={productSearch}
  onChange={(e) => {
    setProductSearch(e.target.value);
    setShowDropdown(true);
  }}
  onFocus={() => setShowDropdown(true)}
  className="border p-3 rounded-lg w-full"
/>
{showDropdown && productSearch && (
  <div className="absolute z-10 bg-white border w-full max-h-60 overflow-auto shadow-lg rounded">

    {productList.length === 0 ? (
      <div className="p-2 text-gray-500">
        No products found
      </div>
    ) : (
      productList.map((product) => (
        <div
          key={product._id}
       onClick={() => {
  setSelectedProduct(product);

  setFormData({
    ...formData,
    product_id: product._id,
  });

  setProductSearch(product.name);
  setShowDropdown(false);
}}
          className="p-2 hover:bg-gray-100 cursor-pointer"
        >
          {product.name}
        </div>
      ))
    )}

  </div>
)}
</div>

          {/* START DATE */}
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({
                ...formData,
                start_date: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          {/* END DATE */}
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({
                ...formData,
                end_date: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={createPromotion}
          className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg transition"
        >
          Create Promotion
        </button>

      </div>

      {/* PROMOTION LIST */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Active Promotions
        </h2>

        {promotions.length === 0 ? (
          <p className="text-gray-500">
            No promotions found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {promotions.map((promo) => (

              <div
                key={promo._id}
                className="border rounded-xl p-4 shadow-sm hover:shadow-lg transition"
              >

                <h3 className="text-lg font-bold text-gray-800">
                  {promo.title}
                </h3>

                <p className="mt-2 text-gray-600">
                  Type:
                  <span className="font-semibold ml-1">
                    {promo.type}
                  </span>
                </p>

                <p className="text-gray-600">
                  Value:
                  <span className="font-semibold ml-1">
                    {promo.value}
                  </span>
                </p>

                <p className="text-gray-600">
                  Product:
                  <span className="font-semibold ml-1">
                    {promo.product_id}
                  </span>
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {promo.start_date} → {promo.end_date}
                </p>

                <div className="mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      promo.is_active
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {promo.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminPromotions;