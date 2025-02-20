import React from "react";
import axiosInstance from "../../axiosInstance";

const Payment = ({ cart }) => {
  // ✅ Handle Payment
  const handlePayment = async () => {
    try {
      await axiosInstance.post("/api/users/payment", { cart });
      alert("Payment Successful!");
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed.");
    }
  };

  return (
    <div className="payment">
      <h2>Payment & Checkout</h2>
      <button onClick={handlePayment} className="btn btn-success">Proceed to Payment</button>
    </div>
  );
};

export default Payment;
