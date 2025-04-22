import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Sample images (replace these with your own paths)
import img1 from "./assets/slider-1.png";
// import img2 from "./assets/banner.png";
import img2 from "./assets/slider-2.png";
import img3 from "./assets/slider-3.png";
// import img3 from "./assets/insta3.jpg";
// import img4 from "./assets/insta4.jpg";
// import img5 from "./assets/insta5.jpg";
// img3, img4, img5
const images = [img1, img2, img3 ];

function Slide() {
  const swiperRef = useRef(null);

  const slidePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const slideNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <section className="slide-section">
      <div className="slide-title"><h3>@yosocare</h3></div>
      <div className="slide-container">
        <button className="nav-button left" onClick={slidePrev}>
          &#10094;
        </button>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            480: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Navigation]}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`slide-${index}`} className="slider-img" />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="nav-button right" onClick={slideNext}>
          &#10095;
        </button>
      </div>
    </section>
  );
}

export default Slide;
