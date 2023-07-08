import React from 'react'
import "./buynow.css";
import { Divider } from '@mui/material';
import Option from './Option';
import Subtotal from './Subtotal';
import Right from './Right';

const Buynow = () => {
    return (
        <div className='buynow_section'>
            <div className='buynow_container'>
                <div className='left_buy'>
                    <h1>Shopping Cart</h1>
                    <p>Select all items</p>
                    <span className='leftbuyprice'>Price</span>
                    <Divider />

                    <div className='item_container'>
                        <img src={require('../cart/shopping.webp')} alt='' />
                        <div className='item_details'>
                            <h3>SSC CGL Tier 2 Computer Knowledge Book English Medium  (Paperback, Pinnacle Publications)</h3>
                            <h3 className='differentprice'>₹360</h3>
                            <p className='unusual'>Delivery by 27 Jun, Tuesday</p>
                            <p>Cash on Delivery available</p>
                            <img src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px-2x._CB485942108_.png" alt='' />
                            <Option />
                        </div>
                        <h3 className='item_price'>₹360</h3>
                    </div>
                    <Divider />
                    <Subtotal />
                </div>
                <Right />
            </div>
        </div>
    )
}

export default Buynow
