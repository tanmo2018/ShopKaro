import React, { useContext, useEffect, useState } from 'react';
import "./cart.css";
import { CircularProgress, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../context/ContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backend = process.env.REACT_APP_BACKEND;



const Cart = () => {

  const [inddata, setInddata] = useState("");
  const { id } = useParams("");

  const history = useNavigate();

  const { account, setAccount } = useContext(LoginContext);

  const getinddata = async () => {
    const res = await fetch(`${backend}/getproductsone/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    // console.log(data);
    if (res.status !== 201) {
      console.log("No data is available!");
    } else {
      setInddata(data);
    }
  }




  //add to cart
  const addtocart = async (id) => {
    const checkers = await fetch(`${backend}/addcart/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inddata
      })
    });

    const data1 = await checkers.json();
    console.log(data1 + "cart");

    if (checkers.status === 401 || !data1) {
      console.log("user invalid");
      alert("user invalid");
    } else {
      setAccount(data1);
      history('/buynow');
    }

  }

  useEffect(() => {
    getinddata();
  }, [id]);

  const checkout = async (e) => {
    e.preventDefault();
    let price = inddata.price.cost;
    const backend = process.env.REACT_APP_BACKEND;
    let order = await fetch(`${backend}/create/orderId`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: price * 100
      })
    })
    let orderdata = await order.json();


    var options = {
      "key": process.env.REACT_APP_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      "amount": price * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": account.fname,
      "image": "https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-120.jpg?",
      "order_id": orderdata.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": function (response) {
        toast.success(`Payment successfull`, {
          position: "top-center",
        });
        toast.success(` Payment ID is: ${response.razorpay_payment_id}`, {
          position: "top-center",
        });
        history("/");

      },
      "theme": {
        "color": "#1F45FC"
      }
    };
    let rzp1 = new window.Razorpay(options);
    rzp1.open();
  }





  return (
    <>
      <div className='cart_section'>
        {inddata && Object.keys(inddata).length &&
          <div className='cart_container'>
            <div className='left_cart'>
              <img src={inddata.detailUrl} alt='' />

              <div className='cart_btn'>
                <button className='cart_btn1' onClick={() => addtocart(inddata.id)}>Add to Cart</button>
                <button className='cart_btn2' onClick={checkout}>Buy Now</button>
              </div>
            </div>

            <div className='right_cart'>
              <h3>{inddata.title.shortTitle}</h3>
              <h4>{inddata.title.longTitle}</h4>
              <Divider />
              <p className='mrp'><del>MRP :₹{inddata.price.mrp}</del></p>
              <p>Deal of the Day : <span style={{ color: "#B12704" }}>₹{inddata.price.cost}</span></p>
              <p>You save : : <span style={{ color: "#B12704" }}>₹{inddata.price.mrp - inddata.price.cost} ({inddata.price.discount})</span></p>

              <div className='discount_box'>
                <h5>Discount : <span style={{ color: "#111" }}>₹{inddata.discount}</span></h5>
                <h4>Free Delivery :<span style={{ color: "#111", fontWeight: 600 }}>Oct 8 - 21</span> Details</h4>
                <p>Fastest Delivery :<span style={{ color: "#111", fontWeight: 600 }}>Oct 8 - 21</span> Tommorow 11AM</p>
              </div>
              <p className='description'>About the Item : <span style={{ color: "#565959", fontSize: 14, fontWeight: 500, letterSpacing: "0.4px" }}>{inddata.description}</span></p>

            </div>
          </div>
        }
        {!inddata ? <div className='loading'>
          <CircularProgress />
          <h2>Loading...</h2>
        </div> : ""
        }
      </div>
    </>
  )
}

export default Cart
