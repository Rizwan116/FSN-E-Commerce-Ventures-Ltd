import React, { useState, useEffect } from "react";
import { database, ref, set, get, child, push, remove } from "./firebase";

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [formData, setFormData] = useState({
    name: "",
    // category: "",
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

  const fetchOrders = async () => {
    try {
      const dbRef = ref(database);
      const ordersSnap = await get(child(dbRef, "orders"));
      
      if (ordersSnap.exists()) {
        const data = ordersSnap.val();
        const ordersArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        
        // Sort orders by timestamp (newest first)
        ordersArray.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    
    // Set up an interval to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      if (activeTab === "products") {
        fetchProducts();
      } else if (activeTab === "orders") {
        fetchOrders();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [activeTab]);

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
      // category: "",
      setFormData({ name: "",  price: "", image: "", stock: "" });
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

  const handleUpdateStock = async (productId, newStock) => {
    const stock = parseInt(newStock);
    if (isNaN(stock) || stock < 0) {
      alert("Please enter a valid stock number");
      return;
    }
    
    try {
      // Try updating in both 'products' and 'product' nodes
      await set(ref(database, `products/${productId}/stock`), stock);
      await set(ref(database, `products/${productId}/inStock`), stock > 0);
      
      // Also check if it exists in the old node
      const oldProductRef = ref(database, `product/${productId}`);
      const oldProductSnap = await get(oldProductRef);
      if (oldProductSnap.exists()) {
        await set(ref(database, `product/${productId}/stock`), stock);
        await set(ref(database, `product/${productId}/inStock`), stock > 0);
      }
      
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTotalOrderValue = (order) => {
    if (!order.cart || !order.cart.items) return 0;
    
    return order.cart.items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === "products" ? "active" : ""} 
          onClick={() => setActiveTab("products")}
        >
          Manage Products
        </button>
        <button 
          className={activeTab === "orders" ? "active" : ""} 
          onClick={() => setActiveTab("orders")}
        >
          View Orders
        </button>
      </div>
      
      {activeTab === "products" && (
        <div className="products-management">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct} className="add-product-form">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
            <input name="price" placeholder="Price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
            <input name="stock" placeholder="Stock" type="number" value={formData.stock} onChange={handleChange} required />
            <button type="submit">Add Product</button>
          </form>

          <h2>Current Products ({products.length})</h2>
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                {/* <th>Category</th> */}
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className={prod.stock <= 0 ? "out-of-stock" : ""}>
                  <td><img src={prod.image} alt={prod.name} className="product-image" /></td>
                  <td>{prod.name}</td>
                  <td>₹{prod.price}</td>
                  {/* <td>{prod.category}</td> */}
                  
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={prod.stock || 0}
                      onChange={(e) => handleUpdateStock(prod.id, e.target.value)}
                      className="stock-input"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleDelete(prod.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === "orders" && (
        <div className="orders-management">
          <h2>Customer Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.id.substring(0, 8)}</h3>
                      <h5 className="order-date">{formatDate(order.timestamp)}</h5>
                    </div>
                    <div className="order-total">
                      <h5>Total: ₹{getTotalOrderValue(order)}</h5>
                      <h5><span className="payment-badge">{order.paymentMode}</span></h5>
                    </div>
                  </div>
                  
                  <div className="customer-info">
                    <h4>Customer Details</h4>
                    <h5>{order.firstName} {order.lastName}</h5>
                    <h5>📱 {order.phone}</h5>
                    <h5>✉️ {order.email}</h5>
                    <h5>🏠 {order.address}, {order.pincode}</h5>
                    {order.nearbyLocation && <h5>📍 Near: {order.nearbyLocation}</h5>}
                  </div>
                  
                  <div className="order-items">
                    <h4>Ordered Items</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.cart && order.cart.items ? (
                          order.cart.items.map((item, index) => (
                            <tr key={index}>
                              <td className="product-cell">
                                {item.image && <img src={item.image} alt={item.title} className="mini-product-image" />}
                                <span>{item.title}</span>
                              </td>
                              <td>₹{item.price}</td>
                              <td>{item.quantity}</td>
                              <td>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">No items found in this order</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
       
      `}</style>
    </div>
  );
}

export default AdminPanel;