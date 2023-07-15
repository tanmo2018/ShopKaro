import React, { useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import { LoginContext } from '../context/ContextProvider';
import { NavLink } from 'react-router-dom';
import { Divider } from '@mui/material';
import "./leftheader.css";
import LogoutIcon from '@mui/icons-material/Logout';



const LeftHeader = ({ logclose, logout }) => {
    const { account, setAccount } = useContext(LoginContext);

    return (
        <div>
            <div className='leftheader'>
                <div className='left_nav'>
                    {account ?
                        <Avatar className='avatar2'>{account.fname[0].toUpperCase()}</Avatar> :
                        <Avatar className='avatar'>U</Avatar>
                    }
                    <h3>Hello, {account ? account.fname.toUpperCase() : "User"}</h3>
                </div>
                <div className='nav_btn' onClick={() => logclose()}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/">Shop By Category</NavLink>

                    <Divider style={{ width: "100%", marginLeft: "-20px" }} />

                    <NavLink to="/">Today's Deal</NavLink>
                    {
                        account ?
                            <NavLink to="/buynow">Your Order</NavLink> :
                            <NavLink to="/login">Your Order</NavLink>

                    }

                    <Divider style={{ width: "100%", marginLeft: "-20px" }} />

                    <div className='flag'>
                        <NavLink to="/">Settings</NavLink>
                        <img src={require('./india.png')} style={{ width: 50, marginLeft: 10 }} alt='' />
                    </div>
                    {
                        account ?
                            <div className='flag' onClick={() => logout()}>
                                <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} />
                                <h3 style={{ cursor: 'pointer', fontWeight: 500 }}>Logout</h3>
                            </div> :
                            <NavLink to="/login">SignIN</NavLink>
                    }
                </div>
            </div>
        </div>
    )
}

export default LeftHeader
