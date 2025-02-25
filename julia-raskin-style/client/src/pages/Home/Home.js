import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import JuliaImages from "../../assets/images/about/JuliaImages";
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
      {/* ✅ Hero Section with Enhanced SEO Content */}
      <section
        className="hero-section text-center"
        style={{
          backgroundImage: `linear-gradient(
            to right, 
            rgba(238, 174, 202, 0.8), 
            rgba(148, 187, 233, 0.8)
          ), url(${JuliaImages.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "150px 20px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="container">
          <h1 className="display-4">Julia Raskin Style</h1>
          <p className="lead">
            Discover the Art of Timeless Elegance and Unmatched Luxury
          </p>
          <p className="hero-description">
            Explore the world of high fashion with Julia Raskin Style. Our
            curated collections are designed for the modern sophisticate who
            values elegance, quality, and individuality. From evening elegance
            to casual chic, redefine your style statement with us.
          </p>
          <p className="hero-highlight">
            Unleash your inner fashionista and inspire the world with your style.
          </p>
        </div>
      </section>

      {/* ✅ Shop Now Section */}
      <section className="shop-section">
        <div className="container text-center">
          <h2>Shop Our Exclusive Collections</h2>
          <p>
            Discover the latest trends and timeless pieces that elevate your
            wardrobe. Shop our exclusive collections and redefine your style.
          </p>
          <Link to="/shop" className="shop-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* ✅ Shopping School Section */}
      <section className="shopping-school-section">
        <div className="container text-center">
          <h2>Want to Learn How to Look Stylish?</h2>
          <p>
            Discover the secrets of timeless elegance and modern chic. Our
            Shopping School offers tips and guides curated by fashion experts.
          </p>
          <Link to="/shopping-school" className="learn-more-btn">
            Learn More
          </Link>
        </div>
      </section>

      {/* ✅ Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="text-center">EXCLUSIVE COLLECTIONS</h2>
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card product-card">
                    <img
                      src={`${product.imageUrl}`}
                      alt={product.name}
                      className="responsive-product-image"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">${product.price}</p>
                      <Link
                        to={`/shop/${product._id}`}
                        className="btn btn-outline-primary"
                      >
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
    </div>
  );
}

export default Home;
