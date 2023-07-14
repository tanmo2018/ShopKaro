import React, { useEffect, useState } from 'react'
import "./buynow.css";

const Subtotal = ({ item }) => {

    const [price, setPrice] = useState(0);

    const totalAmount = () => {
        let totprice = 0;
        item.map((item) => {
            totprice = item.price.cost + totprice;
        })
        setPrice(totprice);
    };

    useEffect(() => {
        totalAmount();
    }, [item])


    return (
        <div className='sub_item'>
            <h3>Subtotal ({item.length} item): <strong style={{ fontWeight: 700, color: "#111" }}>₹{price}</strong></h3>
        </div>
    )
}

export default Subtotal
