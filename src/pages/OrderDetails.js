import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import html2pdf from 'html2pdf.js';

const OrderDetails = () => {
  const location = useLocation();
  const { orderId: orderIdFromURL } = useParams();
  const navigate = useNavigate();

  const orderId = orderIdFromURL || location.state?.orderId;
  const [order, setOrder] = useState(() => {
    const cached = localStorage.getItem('lastOrder');
    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const currentUserEmail = localStorage.getItem('userEmail')?.toLowerCase();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return setLoading(false);

      try {
        const orderRef = ref(database, `orders/${orderId}`);
        const snapshot = await get(orderRef);
        if (snapshot.exists()) {
          const orderData = snapshot.val();
          setOrder(orderData);
          localStorage.setItem('lastOrder', JSON.stringify(orderData));
        } else {
          const cached = localStorage.getItem('lastOrder');
          setOrder(cached ? JSON.parse(cached) : null);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const ordersRef = ref(database, 'orders');
        const snapshot = await get(ordersRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const allOrdersArray = Object.entries(data).map(([key, value]) => ({
            ...value,
            id: key,
          }));

          const userOrders = allOrdersArray.filter(
            (o) => o?.email?.toLowerCase?.() === currentUserEmail
          );

          setAllOrders(userOrders.reverse());
        }
      } catch (error) {
        console.error('Error fetching all orders:', error);
        setAllOrders([]);
      }
    };

    if (currentUserEmail) fetchAllOrders();
  }, [currentUserEmail]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('order-summary');
    html2pdf().from(element).save(`Order_${orderId}.pdf`);
  };

  const renderStatusBadge = (status) => {
    const normalized = status?.toLowerCase?.() || '';
    const variants = {
      processing: 'warning',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'danger',
    };

    const label = status || 'Unknown';
    const variant = variants[normalized] || 'secondary';
    return <span className={`badge bg-${variant}`}>{label}</span>;
  };

  if (loading) return <h4>Loading order details...</h4>;
  if (!order || Object.keys(order).length === 0)
    return <h4>No order found.</h4>;

  const {
    firstName,
    lastName,
    phone,
    email,
    address,
    pincode,
    nearbyLocation,
    paymentMode,
    status,
    cart,
  } = order;

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = allOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allOrders.length / ordersPerPage);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="text-success">🎉 Order Completed Successfully!</h2>
        {renderStatusBadge(status)}
      </div>

      <div id="order-summary" className="border p-4 bg-light rounded mb-4">
        <h4>🧍 Customer Details</h4>
        <h4><strong>Name:</strong> {firstName} {lastName}</h4>
        <h4><strong>Phone:</strong> {phone}</h4>
        <h4><strong>Email:</strong> {email}</h4>
        <h4><strong>Address:</strong> {address}, {pincode}</h4>
        <h4><strong>Nearby:</strong> {nearbyLocation}</h4>
        <h4><strong>Payment Mode:</strong> {paymentMode}</h4>

        <h4 className="mt-4">🛒 Product Summary</h4>
        {Array.isArray(cart?.items) && cart.items.map((item, index) => (
          <div className="d-flex gap-3 border-bottom py-2" key={index}>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="img-thumbnail"
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
            )}
            <div>
              <h5>{item.name || item.title}</h5>
              <h4>Price: ₹{item.price} | Qty: {item.quantity}</h4>
            </div>
          </div>
        ))}
        <h5 className="mt-3"><strong>Total Amount:</strong> ₹{cart?.totalAmount || 0}</h5>
      </div>

      <div className="mb-4">
        <button onClick={handlePrint} className="btn btn-outline-primary me-2">🧾 Print</button>
        <button onClick={handleDownloadPDF} className="btn btn-outline-success">⬇️ Download PDF</button>
        <button onClick={() => navigate('/track-order')} className="btn btn-outline-secondary ms-2">📦 Track Order</button>
      </div>

      <div className="mb-4">
        <button
          className="btn btn-info"
          onClick={() => setShowOrders(!showOrders)}
        >
          {showOrders ? '⬆️ Hide Previous Orders' : '⬇️ Show Previous Orders'}
        </button>
      </div>

      {showOrders && (
        <div className="mb-5">
          <h3>📜 Previous Orders</h3>
          {currentOrders.length === 0 ? (
            <h4>No previous orders.</h4>
          ) : (
            currentOrders.map((prev, index) => (
              <div key={index} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    Order #{indexOfFirst + index + 1} {renderStatusBadge(prev.status)}
                  </h5>
                  <h4><strong>Name:</strong> {prev.firstName} {prev.lastName}</h4>
                  <h4><strong>Email:</strong> {prev.email}</h4>
                  <h4><strong>Phone:</strong> {prev.phone}</h4>
                  <h4><strong>Address:</strong> {prev.address}, {prev.pincode}</h4>
                  <h4><strong>Date:</strong> {prev.timestamp ? new Date(prev.timestamp).toLocaleString() : 'N/A'}</h4>
                  <h4><strong>Payment:</strong> {prev.paymentMode}</h4>
                  <h4><strong>Products:</strong></h4>
                  {prev.cart?.items?.map((item, i) => (
                    <div key={i}>- {item.name || item.title} | ₹{item.price} × {item.quantity}</div>
                  ))}
                  <h4><strong>Total:</strong> ₹{prev.cart?.totalAmount}</h4>
                  <button
                    className="btn btn-outline-primary mt-2"
                    onClick={() =>
                      navigate(`/order-details/${prev.id}`, { state: { orderId: prev.id } })
                    }
                  >
                    🔍 View Details
                  </button>
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li className={`page-item ${currentPage === i + 1 ? 'active' : ''}`} key={i}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;