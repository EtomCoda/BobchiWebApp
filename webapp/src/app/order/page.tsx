import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Order() {
  return (
    <div className="w-screen h-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* Page Header */}
      <div className="w-full text-center mt-12">
        <h1 className="text-4xl font-semibold text-[#278245]">Place Your Order</h1>
      </div>

      {/* Options Section */}
      <div className="w-full mt-12 flex flex-col items-center space-y-12">
        {/* Refill*/}
        <div className="w-[60%] bg-white shadow-md rounded-lg p-8 text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Product 1"
            className="mx-auto mb-4"
          />
          <h3 className="text-2xl font-semibold mb-4">Refill</h3>
          <a
            href="/order/refill"
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Refill
          </a>
        </div>

        {/* Topup */}
        <div className="w-[60%] bg-white shadow-md rounded-lg p-8 text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Product 2"
            className="mx-auto mb-4"
          />
          <h3 className="text-2xl font-semibold mb-4">Top-Up</h3>
          <a
            href="/order/topup"
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Top-Up
          </a>
        </div>

        {/* Others */}
        <div className="w-[60%] bg-white shadow-md rounded-lg p-8 text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Product 3"
            className="mx-auto mb-4"
          />
          <h3 className="text-2xl font-semibold mb-4">Others</h3>
          <a
            href="/order/others"
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Others
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
