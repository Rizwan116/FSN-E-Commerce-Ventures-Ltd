import React from "react";
import productImage from "./assets/about-us.png";
import productImage2 from "./assets/about-us2.png";


const AboutUsCard = ({ image, title, buttonText }) => {
  return (
    <div className="about-us-card">
      <div 
        className="about-us-image-container"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="about-us-overlay">
          <h3 className="about-us-title-text">{title}</h3>
        </div>
      </div>
      <button className="about-us-button">{buttonText}</button>
    </div>
    
  );
};

const About = () => {
  const aboutData = [
    {
      id: 1,
      image: productImage, // Replace with actual images
      title: "Innovative Formulations",
      buttonText: "Read More",
    },
    {
      id: 2,
      image: productImage2, // Replace with actual images
      title: "Science-First Marketing",
      buttonText: "Read More",
    },
    {
      id: 3,
      image: productImage,
      title: "Intentional Ingredients",
      buttonText: "Read More",
    },
    // {
    //   id: 4,
    //   image: productImage,
    //   title: "Intentional Ingredients",
    //   buttonText: "Read More",
    // },
    // {
    //   id: 5,
    //   image: productImage,
    //   title: "Intentional Ingredients",
    //   buttonText: "Read More",
    // },
    // {
    //   id: 6,
    //   image: productImage,
    //   title: "Intentional Ingredients",
    //   buttonText: "Read More",
    // },
  ];

  return (
    <section className="about-us-section">
      <h2 className="about-us-title">About Us</h2>
      <span>Lorem Ipsum dolor sit amet, consectetuer adipicing</span>
      <br/>
      <br/>
      <button className="about-us-title-button" href="">SHOP NOW</button>
      {/* <div className="about-us-container">
        {aboutData.map((item, index) => (
          <AboutUsCard key={index} {...item} />
        ))}
      </div> */}
    </section>
  );
};

export default About;
