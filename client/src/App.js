import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/header/Navbar';
import Newnavbar from './components/newnavbar/Newnavbar';
import Maincomp from './components/home/Maincomp';
import Sign_in from './components/signin_signup/Sign_in';
import Sign_up from './components/signin_signup/Sign_up';
import Cart from './components/cart/Cart';
import Buynow from './components/buynow/Buynow';
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Newnavbar />
      <Routes>
        <Route path='/' Component={Maincomp} />
        <Route path='/login' Component={Sign_in} />
        <Route path='/register' Component={Sign_up} />
        <Route path='/getproductsone/:id' Component={Cart} />
        <Route path='/buynow' Component={Buynow} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
