import banner from './assets/homepage_banner.jpg'
function Banner() {

    return (
      <section className="hero-banner-section">
      <div className="banner-container">
      
        <div className="main">
          <img
            src={banner}
            alt="Lip Nectar"
            className="mainbanner"
          />
        </div>
      </div>
    </section>
    );
  }
  
  export default Banner;