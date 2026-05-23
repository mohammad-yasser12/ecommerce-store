import { useEffect, useState,useRef } from "react";
import API from "../../api/axios";
import { IoArrowBack } from "react-icons/io5";

function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productList, setProductList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const promotionsPerPage = 2;
const formRef = useRef(null);

  const [errors, setErrors] = useState({});
  const indexOfLastPromotion = currentPage * promotionsPerPage;
const indexOfFirstPromotion = indexOfLastPromotion - promotionsPerPage;

const currentPromotions = promotions.slice(
  indexOfFirstPromotion,
  indexOfLastPromotion
);

const totalPages = Math.ceil(promotions.length / promotionsPerPage);
  
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


  const validateForm = () => {
  const newErrors = {};

  if (!formData.title) newErrors.title = "Title is required";

  if (formData.type === "none")
    newErrors.type = "Select promotion type";

  if (!formData.value)
    newErrors.value = "Value is required";

  if (!formData.product_id)
    newErrors.product_id = "Select a product";

  if (!formData.start_date)
    newErrors.start_date = "Start date required";

  if (!formData.end_date)
    newErrors.end_date = "End date required";

  if (formData.start_date && formData.end_date &&
      formData.end_date < formData.start_date) {
    newErrors.end_date = "End date must be after start date";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
  // 🔥 CREATE PROMOTION
const savePromotion = async () => {
  try {

    if (editingId) {

      // ✅ UPDATE
      await API.put(
        `/promotions/${editingId}`,
        formData
      );

      alert("Promotion updated 🎉");

    } else {

      // ✅ CREATE
      await API.post(
        "/promotions",
        formData
      );

      alert("Promotion created 🎉");
    }

    // RESET FORM
    setFormData({
      title: "",
      type: "percentage",
      value: "",
      product_id: "",
      start_date: "",
      end_date: "",
    });

    setEditingId(null);

    setSelectedProduct(null);

    setProductSearch("");

    fetchPromotions();

  } catch (err) {
    console.log(err);
  }
};

  const handleDelete = async (id) => {
  try {
    await API.delete(`/promotions/${id}`);
    fetchPromotions(); // refresh list
  } catch (err) {
    console.log(err);
  }
};

const handleEdit = (promo) => {
  setFormData({
    title: promo.title,
    type: promo.type,
    value: promo.value,
    product_id: promo.product_id,
    start_date: promo.start_date,
    end_date: promo.end_date,
  });

  setEditingId(promo._id);
  setProductSearch(
  promo.product?.name || ""
);

setSelectedProduct(
  promo.product || null
);

  formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
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
      <div 
        ref={formRef}
      className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Create Promotion
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* TITLE */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold  text-blue-700">
              Promotion Title
            </label>
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
          </div>
         

          {/* TYPE */}
            <div className="flex flex-col gap-2">
            <label className="font-semibold  text-blue-700">
              Promotion Value Type
            </label>

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
            </div>

         

          {/* VALUE */}
            <div className="flex flex-col gap-2">
            <label className="font-semibold  text-blue-700">
            Promotion Value
            </label>
             <input
            type="number"
            placeholder="Promotion Value"
            value={formData.value}
            onChange={(e) =>
              setFormData({
                ...formData,
                value: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />
            </div>
         

          {/* PRODUCT */}
          <div className="relative w-full mt-2 ">
             <label className="font-semibold  text-blue-700">
              Promotion Product
            </label>

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
              <div className="absolute z-10 bg-white border w-full max-h-72 overflow-auto shadow-lg rounded-xl">

                {productList.length === 0 ? (

                  <div className="p-3 text-gray-500">
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
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b"
                    >

                      {/* Product Image */}
                      <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />

                      {/* Product Info */}
                      <div className="flex-1">

                        <p className="font-semibold text-sm">
                          {product.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          ID: {product._id}
                        </p>

                        <p className="text-xs text-green-600">
                          ₹ {product.price}
                        </p>

                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* START DATE */}


          <div className="flex flex-col gap-2">

            <label className="font-semibold  text-blue-700">
              Start Date
            </label>

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.start_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  start_date: e.target.value,
                })
              }
              className="border p-3 rounded-lg"
            />

          </div>

          <div className="flex flex-col gap-2">

            <label className="font-semibold text-blue-700">
              End Date
            </label>

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



        </div>

        {/* BUTTON */}
      <div className="flex gap-3 mt-5">

<button
  onClick={() => {
    if (!validateForm()) return;

    savePromotion();
  }}
  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg transition"
>
  {editingId
    ? "Update Promotion"
    : "Create Promotion"}
</button>

<button
  onClick={() => {
    setFormData({
      title: "",
      type: "none",
      value: "",
      product_id: "",
      start_date: "",
      end_date: "",
    });

    setSelectedProduct(null);

    setProductSearch("");

    setErrors({});

    // ✅ EXIT EDIT MODE
    setEditingId(null);
  }}
  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg transition"
>
  Clear
</button>

</div>
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {currentPromotions.map((promo) => (
          <div
            key={promo._id}
            className="relative border rounded-xl p-4 shadow-sm hover:shadow-lg transition"
          >

            {/* THREE DOT MENU */}
            <div className="absolute top-3 right-3">

              <button
                onClick={() =>
                  setOpenMenuId(
                    openMenuId === promo._id
                      ? null
                      : promo._id
                  )
                }
                className="text-xl font-bold px-2"
              >
                ⋮
              </button>

              {openMenuId === promo._id && (
                <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-lg z-10">

                  <button
                    onClick={() => {
                      handleEdit(promo);
                      setOpenMenuId(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      handleDelete(promo._id);
                      setOpenMenuId(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Delete
                  </button>

                </div>
              )}
            </div>

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
                {promo.product?.name || "No Product"}
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
                {promo.is_active ? "Active" : "Inactive"}
              </span>
            </div>

          </div>
        ))}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-6">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <p className="font-semibold">
          {currentPage} / {totalPages}
        </p>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </>
  )}

</div>

    </div>
  );
}

export default AdminPromotions;