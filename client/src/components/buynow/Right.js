import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../context/ContextProvider';
import "./buynow.css";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backend = process.env.REACT_APP_BACKEND;

const Right = ({ item, get }) => {

    const [price, setPrice] = useState(0);
    const { account, setAccount } = useContext(LoginContext);
    const history = useNavigate();


    const totalAmount = async () => {
        let totprice = 0;
        item.map((item) => {
            totprice = item.price.cost + totprice;
        })
        setPrice(totprice);
    };

    useEffect(() => {
        totalAmount();
    }, [item])

    const checkout = async (e) => {
        e.preventDefault();
        let order = await fetch("/create/orderId", {
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
        console.log(orderdata);


        var options = {
            "key": process.env.REACT_APP_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
            "amount": price * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": account.fname,
            "image": "https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-120.jpg?",
            "order_id": orderdata.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function (response) {
                try {
                    const res = await fetch(`${backend}/removeall`, {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        }
                    });

                    const data = await res.json();
                    // console.log(data);

                    if (res.status === 400 || !data) {
                        console.log("error");
                    } else {
                        // console.log("user delete");
                        setAccount(data);
                        toast.success(`Payment successfull`, {
                            position: "top-center",
                        });
                        toast.success(` Payment ID is: ${response.razorpay_payment_id}`, {
                            position: "top-center",
                        });
                        history("/");
                        get();

                    }
                } catch (error) {
                    console.log("error");
                }


            },
            "theme": {
                "color": "#1F45FC"
            }
        };
        let rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on('payment.failed', function (response) {
            toast.warn('Something wrong!', {
                position: "top-center",
            });
        });
    }

    return (
        <div className='right_buy'>
            <img src='https://images-eu.ssl-images-amazon.com/images/G/31/checkout/assets/TM_desktop._CB443006202_.png' alt=' ' />
            <div className='cost_right'>
                <p>Your order is eligible for FREE Delivery.</p><br />
                <span style={{ color: "#565959" }}>Select this option at checkout. Details</span>
                <h3>
                    Subtotal ({item.length} items): <span style={{ fontWeight: 700 }}>₹{price}</span>
                </h3>
                <button className='rightbuy_btn' onClick={checkout}>Process to Buy</button>
                <div className='emi'>
                    Emi available
                </div>
            </div>
        </div>
    )
}

export default Right
