import React from 'react';
import Banner from "./Banner";
import ProductCollection from "./ProductCollection";
import About from "./About";
import SlideShow from "./SlideShow";
import PageTransition from "./PageTransition";


// ✅ Import your actual homepage banner image
import banner from "./assets/Asset.png";
import Announcement from './Announcement';


function Home() {
  return (
    <PageTransition>
    <div className="App-background">
      <header className="App-header">

      <Announcement />

        {/* ✅ Fixed: Properly passing the image to the Banner component */}
        <Banner image={banner}  style={{ margin: '0px 0px 0px 0px' }}  />

        <About />
        
        <ProductCollection />
        
        <SlideShow />
        {/* <Footer /> */}
        
      
        
       

      </header>
    </div>
    </PageTransition>

  );
}

export default Home;
