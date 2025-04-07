import React, { useState, useEffect } from "react";
import { database, ref, set, get, child, push, remove } from "./firebase";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    stock: "",
  });

  const fetchProducts = async () => {
    try {
      const dbRef = ref(database);

      // Fetch from new 'products' node
      const newSnap = await get(child(dbRef, "products"));
      let newProducts = [];
      if (newSnap.exists()) {
        const data = newSnap.val();
        newProducts = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
      }

      // Fetch from old 'product' node
      const oldSnap = await get(child(dbRef, "product"));
      let oldProducts = [];
      if (oldSnap.exists()) {
        const data = oldSnap.val();
        oldProducts = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
      }

      // Combine both lists
      setProducts([...newProducts, ...oldProducts]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      inStock: parseInt(formData.stock) > 0,
    };

    try {
      const newProductRef = push(ref(database, "products")); // Save to "products" node
      await set(newProductRef, newProduct);
      fetchProducts();
      setFormData({ name: "", category: "", price: "", image: "", stock: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Try deleting from both 'products' and 'product'
      await remove(ref(database, `products/${id}`));
      await remove(ref(database, `product/${id}`));
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Add Product</h2>
      <form onSubmit={handleAddProduct}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" value={formData.price} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
        <input name="stock" placeholder="Stock" type="number" value={formData.stock} onChange={handleChange} />
        <button type="submit">Add Product</button>
      </form>

      <h3>Current Products</h3>
      <ul>
        {/* {products.map(prod => (
          <li key={prod.id}>
            {prod.name} - {prod.category} - ₹{prod.price} - Stock: {prod.stock}
            <button onClick={() => handleDelete(prod.id)}>Delete</button>
          </li>
        ))} */}
        {products.map((prod) => (
  <li key={prod.id}>
    <div className="product-info">
      <img src={prod.image} alt={prod.name} className="product-image" />
      <div>
        <strong>{prod.name}</strong> <br />
        Category: {prod.category} <br />
        ₹{prod.price} - Stock: {prod.stock}
      </div>
    </div>
    <button onClick={() => handleDelete(prod.id)}>Delete</button>
  </li>
))}
      </ul>
    </div>
  );
}

export default AdminPanel;
