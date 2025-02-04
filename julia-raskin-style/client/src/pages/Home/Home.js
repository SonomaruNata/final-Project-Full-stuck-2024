import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // ✅ Import axios
import backgroundImage from "../../assets/images/about/backgroundImage.jpg"; // ✅ Import background image
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  // ✅ Fetch Products from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      {/* ✅ Hero Section with Background Image */}
      <section
        className="hero-section text-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="container">
          <h1 className="display-4 font-weight-bold">Julia Raskin Style</h1>
          <p className="lead">
            Discover the latest in fashion with a unique and personalized touch.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg mt-3">
            Shop Now
          </Link>
        </div>
      </section>

      {/* ✅ Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="text-center">STYLE on COLLECTION</h2>
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card">
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">${product.price}</p>
                      <Link to={`/shop/${product._id}`} className="btn">
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Loading products...</p>
            )}
          </div>
        </div>
      </section>

      {/* ✅ About Banner Section */}
      <section className="about-banner">
        <div className="container text-center">
          <h2>About Julia Raskin Style</h2>
          <p className="lead">
            Founded by Julia Raskin, our brand is committed to offering a
            curated collection of fashion pieces that empower you to look and
            feel your best. Join us on a journey to discover your unique style.
          </p>
          <Link to="/about" className="btn">
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
