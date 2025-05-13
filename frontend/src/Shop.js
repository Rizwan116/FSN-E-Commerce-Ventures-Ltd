import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './redux/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

useEffect(() => {
  fetch('http://localhost:5000/api/products')
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched products:", data);

      if (Array.isArray(data)) {
        setProducts(data);
        setFiltered(data);
        extractCategories(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
        setFiltered(data.products);
        extractCategories(data.products);
      } else {
        console.error("Unexpected data format", data);
        setProducts([]);
        setFiltered([]);
      }
    })
    .catch((err) => {
      console.error('Failed to load products:', err);
      setProducts([]);
      setFiltered([]);
    });
}, []);

  const extractCategories = (data) => {
    const categories = ['All', ...new Set(data.map((item) => item.category || 'Uncategorized'))];
    setCategoryList(categories);
  };

  const handleAddToCart = (product) => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    const currentQtyInCart = cartItem ? cartItem.quantity : 0;

    if (product.stock === 0 || currentQtyInCart >= product.stock) {
      toast.error(`${product.name || product.title} is out of stock!`);
      return;
    }

    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name || product.title} added to cart 🛒`);
  };

  const handleSort = (option) => {
    let sorted = [...filtered];
    switch (option) {
      case 'priceLowHigh':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'nameAZ':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameZA':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'bestSelling':
        sorted.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      case 'newToOld':
        sorted.sort((a, b) => new Date(b.dateAdded || '') - new Date(a.dateAdded || ''));
        break;
      default:
        break;
    }
    setFiltered(sorted);
    setSortOption(option);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFiltered(products);
    } else {
      const filteredByCategory = products.filter((item) => item.category === category);
      setFiltered(filteredByCategory);
    }
  };

  

  return (
    <div className="shop-page">
      <h2>🛍️ Welcome to the Shop</h2>

      <div className="filter-controls">
        <select value={sortOption} onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="nameAZ">Name: A to Z</option>
          <option value="nameZA">Name: Z to A</option>
          <option value="bestSelling">Best Selling</option>
          <option value="newToOld">New to Old</option>
        </select>

        <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
          {categoryList.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="product-list">
        {filtered.map((product) => {
          const cartItem = cartItems.find((item) => item.id === product.id);
          const currentQtyInCart = cartItem ? cartItem.quantity : 0;
          const outOfStock = product.stock === 0 || currentQtyInCart >= product.stock;

          return (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <h3 className="product-rating">⭐ {product.ratings || 4.0}</h3>
              <h3 className="product-price">₹ {product.price}</h3>
              {outOfStock ? (
                <button className="add-to-cart-btn" disabled>❌ Not Available</button>
              ) : (
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                  Add to Cart 🛒
                </button>
              )}
            </div>
          );
        })}
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Shop;
