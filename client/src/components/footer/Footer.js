import React from 'react'
import "./footer.css";

const Footer = () => {
    const year=new Date().getFullYear();
  return (
    <footer>
        <div className='footer_container'>
            <div className='footr_details_one'>
                <h3>Get to know US</h3>
                <p>About us</p>
                <p>Careers</p>
                <p>Press Releases</p>
                <p>Amazon Cares</p>
            </div>
            <div className='footr_details_one'>
                <h3>Connect with US</h3>
                <p>Facebook</p>
                <p>Twitter</p>
                <p>Instragram</p>
            </div>
            <div className='footr_details_one forres'>
                <h3>Make Money with US</h3>
                <p>Facebook</p>
                <p>Twitter</p>
                <p>Instragram</p>
            </div>
            {/* forres for mobile ->show 2 clm  */}
            <div className='footr_details_one forres'>
                <h3>Make Money with US</h3>
                <p>Facebook</p>
                <p>Twitter</p>
                <p>Instragram</p>
            </div>
        </div>

        <div className='lastdetails'>
            <img src={require("./amazon_PNG25.png")} alt='' />
            <p>Conditions of Use & Sale &nbsp; &nbsp;&nbsp;  Privacy Notice  &nbsp; &nbsp;&nbsp; Interest-Based Ads  &nbsp; &nbsp;&nbsp;  © 1996-{year}, Amazon.com, Inc. or its affiliates</p>
        </div>
    </footer>
  )
}

export default Footer
