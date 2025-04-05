import React from 'react';


function Banner({ image, text, ctaText, onCtaClick, style  }) {
  return (
    <section className="hero-banner-section">
      <div className="banner-container">
        <div className="main">
          <img src={image} alt="Banner" className="mainbanner" style={style} />

          {/* Overlay Content */}
          {(text || ctaText) && (
            <div className="banner-overlay">
              {text && <p className="banner-text">{text}</p>}
              {<br/>}
              {<br/>}
              {<br/>}
              {ctaText && (
                <button className="banner-cta" onClick={onCtaClick}>
                  {ctaText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Banner;
