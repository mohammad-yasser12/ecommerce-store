import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/signup", form);
    console.log(res.data);

    alert("Signup successful");

    // ✅ go to login page
    navigate("/login");

  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Signup failed");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Button */}
        <button className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200">
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-blue-500 mt-4">
          Already have an account?{" "}
         <span
  onClick={() => navigate("/login")}
  className="text-blue-500 cursor-pointer hover:underline"
>
  Login
</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;