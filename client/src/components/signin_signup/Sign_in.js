import React, { useContext, useState } from 'react'
import "./sign_up.css";
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from '../context/ContextProvider';

const backend = "http://localhost:8005";

const Sign_in = () => {
    const [logdata, setData] = useState({
        email: "",
        password: ""
    });

    const { account, setAccount } = useContext(LoginContext);


    // console.log(logdata);
    const addData = (e) => {
        const { name, value } = e.target;
        setData(() => {
            return {
                ...logdata,
                [name]: value
            }
        })
    }

    const sendData = async (e) => {
        e.preventDefault(); //submit won't refresh the page
        const { email, password } = logdata;

        const res = await fetch(`/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });
        const data = await res.json();
        // console.log(data);
        if (res.status === 400 || !data) {
            toast.warn('Something wrong!', {
                position: "top-center",
            });
        } else {
            setAccount(data);
            toast.success('Matched', {
                position: "top-center",
            });
            console.log(data);
            setData({ ...logdata, email: "", password: "" });
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
                        <h1>Sign In</h1>
                        <div className='form_data'>
                            <label htmlFor='email'>Email</label>
                            <input onChange={addData} type='email' value={logdata.email} name='email' id='email' />
                        </div>
                        <div className='form_data'>
                            <label htmlFor='password'>Password</label>
                            <input onChange={addData} type='password' value={logdata.password} name='password' placeholder='At least 6 characters' id='password' />
                        </div>
                        <button className='signin_btn' onClick={sendData}>Continue</button>
                    </form>
                </div>
                <div className='create_accountinfo'>
                    <p>New To Amazon</p>
                    <NavLink to="/register"><button>Create Your amazon account</button></NavLink>
                </div>
                <ToastContainer />
            </div>
        </section>
    )
}

export default Sign_in
