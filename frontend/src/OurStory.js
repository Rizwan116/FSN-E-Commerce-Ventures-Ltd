import React from "react";
import StoryCircle from "../src/assets/OurStory.png"


const OurStory = () => {
 

  return (
    <section className="about-us-section">
      <h3 style={{textTransform: "capitalize"}} className="about-us-title">Our Story</h3>
      <span style={{textTransform: "uppercase"}}>From our hands to yours, YŌSO offers a promise of authenticity, sustainability, and enduring beauty.</span>
      <br/>
      <br/>
      
      <div className="story-img-container">
        <img src={StoryCircle} />
        <img src={StoryCircle} />
        <img src={StoryCircle} />
      </div>
    </section>
  );
};

export default OurStory;
