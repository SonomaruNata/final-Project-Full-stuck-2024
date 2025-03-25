import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import "./Payment.css";

const Payment = ({ cart }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handlePayment = async () => {
    if (!cart || cart.items.length === 0) {
      setStatus("Cart is empty.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await axiosInstance.post("/api/orders", {
        shippingAddress: {
          street: "123 Demo St",
          city: "Demo City",
          country: "Neverland",
        },
        paymentMethod: "credit_card", // Optional: use Stripe/paypal/etc.
      });

      setStatus("✅ Payment Successful. Order Placed!");
      console.log("Order response:", response.data);
    } catch (error) {
      console.error("❌ Payment Error:", error);
      setStatus("❌ Payment Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment">
      <h2>Payment & Checkout</h2>
      <button
        onClick={handlePayment}
        className="btn btn-success"
        disabled={loading}
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
      {status && <p className="payment-status">{status}</p>}
    </div>
  );
};

export default Payment;
