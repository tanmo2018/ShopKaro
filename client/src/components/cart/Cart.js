import React, { useContext, useEffect, useState } from 'react';
import "./cart.css";
import { CircularProgress, Divider } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../context/ContextProvider';

//env is not initialize!!!!!!!!!!!!!!!!!
const backend = "http://localhost:8005";
// console.log(process.env.backend);

const Cart = () => {

  const [inddata, setInddata] = useState("");
  const { id } = useParams("");

  const history = useNavigate("");

  const { account, setAccount } = useContext(LoginContext);

  const getinddata = async () => {
    const res = await fetch(`${backend}/getproductsone/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    console.log(data);
    if (res.status !== 201) {
      console.log("No data is available!");
    } else {
      setInddata(data);
    }
  }



  //add to cart
  const addtocart = async (id) => {
    const checkers = await fetch(`/addcart/${id}`, {
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
    // console.log(data1 + "cart");

    if (checkers.status === 401 || !data1) {
      console.log("user invalid");
      alert("user invalid");
    } else {
      setAccount(data1);
      history('/buynow');
    }

  }

  useEffect(() => {
    setTimeout(() => {
      getinddata();
    }, 1000)
  }, [id]);



  return (
    <>
      <div className='cart_section'>
        {inddata && Object.keys(inddata).length &&
          <div className='cart_container'>
            <div className='left_cart'>
              <img src={inddata.detailUrl} alt='' />

              <div className='cart_btn'>
                <button className='cart_btn1' onClick={() => addtocart(inddata.id)}>Add to Cart</button>
                <button className='cart_btn2'>Buy Now</button>
              </div>
            </div>

            <div className='right_cart'>
              <h3>{inddata.title.shortTitle}</h3>
              <h4>{inddata.title.longTitle}</h4>
              <Divider />
              <p className='mrp'>{inddata.price.mrp}</p>
              <p>Deal of the Day : <span style={{ color: "#B12704" }}>{inddata.price.cost}</span></p>
              <p>You save : : <span style={{ color: "#B12704" }}>{inddata.price.mrp - inddata.price.cost} {inddata.price.discount}</span></p>

              <div className='discount_box'>
                <h5>Discount : <span style={{ color: "#111" }}>{inddata.discount}</span></h5>
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
