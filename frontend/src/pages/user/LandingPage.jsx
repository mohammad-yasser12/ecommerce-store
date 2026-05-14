import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-r from-purple-100 to-blue-100">

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-fadeIn">

        <h1 className="text-5xl font-bold mb-4 animate-slideUp">
          Welcome to MyStore 🛍️
        </h1>

        <p className="text-gray-700 text-lg max-w-xl animate-slideUp delay-200">
          Discover amazing products, best deals, and exclusive offers
          all in one place. Shop smarter, not harder.
        </p>

        <div className="flex gap-4 mt-6 animate-slideUp delay-500">

          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 hover:scale-105 transition duration-300"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 hover:scale-105 transition duration-300"
          >
            Get Started
          </button>

        </div>

      </div>

      {/* FEATURES */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 pb-20">

  <div className="
    bg-white p-6 rounded-xl shadow
    transition-all duration-500
    hover:scale-105 hover:-translate-y-3
    hover:shadow-2xl hover:z-10
    transform-gpu
    animate-card
  ">
    <h2 className="font-bold text-xl mb-2">⚡ Fast Delivery</h2>
    <p>Get your products delivered quickly and safely.</p>
  </div>

  <div className="
    bg-white p-6 rounded-xl shadow
    transition-all duration-500
    hover:scale-105 hover:-translate-y-3
    hover:shadow-2xl hover:z-10
    transform-gpu
    animate-card delay-200
  ">
    <h2 className="font-bold text-xl mb-2">💰 Best Prices</h2>
    <p>We offer unbeatable prices and daily discounts.</p>
  </div>

  <div className="
    bg-white p-6 rounded-xl shadow
    transition-all duration-500
    hover:scale-105 hover:-translate-y-3
    hover:shadow-2xl hover:z-10
    transform-gpu
    animate-card delay-500
  ">
    <h2 className="font-bold text-xl mb-2">🔒 Secure Payments</h2>
    <p>Safe and encrypted payment with Razorpay integration.</p>
  </div>

</div>
      {/* CTA BANNER */}
      <div className="bg-black text-white text-center py-10 animate-slideLeft">
        <h2 className="text-2xl font-bold mb-3">
          Ready to start shopping?
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="bg-white text-black px-6 py-2 rounded-lg hover:scale-105 transition duration-300"
        >
          Shop Now
        </button>
      </div>

      {/* CUSTOM ANIMATION */}
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(60px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideLeft {
            from {
              opacity: 0;
              transform: translateX(-100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-slideUp {
            animation: slideUp 1s ease forwards;
          }

          .animate-slideLeft {
            animation: slideLeft 1s ease forwards;
          }

          .animate-fadeIn {
            animation: fadeIn 1.2s ease forwards;
          }

          .animate-card {
            animation: slideUp 1s ease forwards;
          }

          .delay-200 {
            animation-delay: 0.2s;
          }

          .delay-500 {
            animation-delay: 0.5s;
          }
        `}
      </style>

    </div>
  );
}

export default LandingPage;