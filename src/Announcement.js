import { useState, useEffect } from "react";

  const Announcement = () => {
    const announcements = [
      "Buy 2 or more products to get FLAT 15% OFF with code TAKE2",
      "Buy 3 or more products to get FLAT 15% OFF with code TAKE2",
      "Buy 4 or more products to get FLAT 15% OFF with code TAKE2",
    ];

    const [index, setIndex] = useState(0);
    const [fadeKey, setFadeKey] = useState(0); // Force re-render to trigger animation


    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        setFadeKey((prevKey) => prevKey + 1); // Change key to reset animation
      }, 2000); // Change text every 5 seconds
  
      return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div className="announcement-section">
      <div className="single-announcement-slide">
      <p key={fadeKey} className="slide-in">{announcements[index]}</p>
      </div>
    </div>
    );
  }

  export default Announcement;