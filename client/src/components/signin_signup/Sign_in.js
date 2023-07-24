import React, { useContext, useState } from 'react'
import "./sign_up.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginContext } from '../context/ContextProvider';

const backend = process.env.REACT_APP_BACKEND;


const Sign_in = () => {

    const { account, setAccount } = useContext(LoginContext);
    const [logdata, setData] = useState({
        email: "",
        password: ""
    });
    const history = useNavigate();



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
        try {
            const res = await fetch(`${backend}/login`, {
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
                toast.success('Logged in successfuly', {
                    position: "top-center",
                });
                setData({ ...logdata, email: "", password: "" });
                history("/");
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <section>
            <div className='sign_container'>
                <div className='sign_header'>
                    <img src={require('./logoblack.png')} alt='shopkarologo' />
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
                    <p>New To ShopKaro</p>
                    <NavLink to="/register"><button>Create Your shopkaro account</button></NavLink>
                </div>
                <ToastContainer />
            </div>
        </section>
    )
}

export default Sign_in
