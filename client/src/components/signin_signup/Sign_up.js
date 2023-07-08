import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const backend = process.env.backend || "http://localhost:8005";

const Sign_up = () => {

    const [udata, setData] = useState({
        fname: "",
        email: "",
        mobile: "",
        password: "",
        cpassword: ""
    });

    const addData = (e) => {
        const { name, value } = e.target;
        setData(() => {
            return {
                ...udata,
                [name]: value
            }
        })
    }

    // console.log(udata);

    const sendData = async (e) => {
        e.preventDefault(); //submit won't refresh the page
        const { fname, email, mobile, password, cpassword } = udata;

        const res = await fetch(`${backend}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fname, email, mobile, password, cpassword
            })
        });
        const data = await res.json();
        // console.log(data);
        if (res.status === 422 || !data) {
            toast.warn('Something wrong!', {
                position: "top-center",
            });
        } else {
            toast.success('Successfully Added', {
                position: "top-center",
            });
            setData({ ...udata, fname: "", email: "", mobile: "", password: "", cpassword: "" });
        }
    }

    return (
        <section>
            <div className='sign_container'>
                <div className='sign_header'>
                    <img src={require('./blacklogoamazon.png')} alt='amazonlogo' />
                </div>
                <div className='sign_form'>
                    <form method='POST'>
                        <h1>Create account</h1>

                        <div className='form_data'>
                            <label htmlFor='fname'>Your name</label>
                            <input type='text' onChange={addData} value={udata.fname} name='fname' id='fname' />
                        </div>

                        <div className='form_data'>
                            <label htmlFor='email'>Email</label>
                            <input type='email' onChange={addData} value={udata.email} name='email' id='email' />
                        </div>

                        <div className='form_data'>
                            <label htmlFor='number'>Mobile</label>
                            <input type='text' onChange={addData} value={udata.mobile} name='mobile' id='mobile' />
                        </div>

                        <div className='form_data'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' onChange={addData} value={udata.password} name='password' placeholder='At least 6 characters' id='password' />
                        </div>

                        <div className='form_data'>
                            <label htmlFor='cpassword'>Confirm Password</label>
                            <input type='password' onChange={addData} value={udata.cpassword} name='cpassword' id='cpassword' />
                        </div>
                        <button className='signin_btn' onClick={sendData}>Continue</button>

                        <div className='signin_info'>
                            <p>Already have an account?</p>
                            <NavLink to='/login'>signin</NavLink>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </section>
    )
}

export default Sign_up
