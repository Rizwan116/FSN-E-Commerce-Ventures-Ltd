import Banner from "./Banner";
import ProductCollection from "./ProductCollection";
import About from "./About";
import Instagram from "./Instagram";
import Footer from "./Footer";


function Home() {

    return (
      <div className="App-background">
        <header className="App-header">
         
      <Banner />
      <ProductCollection />
      <About />
     
      
      <Instagram />
      <Footer />
          
        </header>
  
        
      </div>

      
    );
  }
  
  export default Home;