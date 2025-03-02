const fetchProducts = useCallback(async () => {
  setLoading(true);
  setError("");
  try {
    const response = await axios.get(`${API_URL}/api/products`, {
      withCredentials: true, // ✅ Ensure credentials are included
    });
    console.log("✅ Products Loaded:", response.data);
    setProducts(response.data);
  } catch (err) {
    setError(err.response?.data?.message || "⚠️ Error loading products. Try again later.");
    console.error("❌ Error fetching products:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
}, []);
