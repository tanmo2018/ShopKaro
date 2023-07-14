import React, { useEffect, useState } from 'react'
import "./buynow.css";
import { Divider } from '@mui/material';
import Option from './Option';
import Subtotal from './Subtotal';
import Right from './Right';

const Buynow = () => {

    const [cartdata, setCartdata] = useState("");
    // console.log(cartdata.carts);

    const getdatabuy = async () => {
        const res = await fetch("/cartdetails", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.status != 201) {
            console.log("error");
        } else {
            setCartdata(data.carts);
        }
    };

    useEffect(() => {
        getdatabuy();
    }, []);

    return (
        cartdata.length != 0 ?
            <div className='buynow_section'>
                <div className='buynow_container'>
                    <div className='left_buy'>
                        <h1>Shopping Cart</h1>
                        <p>Select all items</p>
                        <span className='leftbuyprice'>Price</span>
                        <Divider />

                        {
                            cartdata.map((e, k) => {
                                return (
                                    <>
                                        <div className='item_container'>
                                            <img src={e.detailUrl} alt='' />
                                            <div className='item_details'>
                                                <h3>{e.title.longTitle}</h3>
                                                <h3>{e.title.shortTitle}</h3>
                                                <h3 className='differentprice'>{e.price.mrp - e.price.cost}</h3>
                                                <p className='unusual'>Delivery by 27 Jun, Tuesday</p>
                                                <p>Cash on Delivery available</p>
                                                <img src="https://www.adgully.com/img/800/68264_fl.png.jpg" alt='' />
                                                <Option deletedata={e.id} get={getdatabuy} />
                                            </div>
                                            <h3 className='item_price'>₹{e.price.cost}</h3>
                                        </div>
                                        <Divider />
                                    </>
                                )
                            })
                        }

                        <Subtotal item={cartdata} />
                    </div>
                    <Right item={cartdata} />
                </div>
            </div> : ""
    )
}

export default Buynow
