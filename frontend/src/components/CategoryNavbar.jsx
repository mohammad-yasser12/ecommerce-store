import { useNavigate } from "react-router-dom";

function CategoryNavbar() {
  const navigate = useNavigate();

 const categories = [
  "All",
  "Electronics",
  "Mobile Phones",
  "Laptops",
  "Fashion",
  "Beauty",
  "Grocery",
  "Home & Kitchen",
  "Sports & Fitness",
  "Baby Products",
  "Books",
  "Automotive",
  "Toys & Games",

];

  const handleClick = (category) => {
    if (category === "All") {
      navigate("/products");
    } else {
      navigate(`/category/${category}`);
    }
  };

  return (
    <div className="bg-[#232f3e] text-white overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center gap-6 px-4 py-3 min-w-max">
        {categories.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(item)}
            className="text-sm font-medium hover:border hover:border-white px-2 py-1 rounded transition"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryNavbar;