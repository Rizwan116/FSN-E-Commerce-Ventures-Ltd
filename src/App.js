
import Announcement from "./Announcement";
import HeaderBar from "./Header";
import Navbar from "./Navbar";
// import Home from "./Home";


function App() {

  return (
    <div className="App">
        <Announcement />
        <HeaderBar />
        <Navbar />
       
      <div className="content">
       
      <Home />
    
        
      </div>

    
      
    </div>
  );
}

export default App;
