import React, { useContext, useEffect } from 'react';
import "./navbar.css";
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import { NavLink } from 'react-router-dom';
import { LoginContext } from '../context/ContextProvider';
//material.ui
const Navbar = () => {

    const { account, setAccount } = useContext(LoginContext);
    console.log(account);

    const getDetailValidUser = async () => {
        const res = await fetch("/validuser", {
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
            console.log("valid data");
            setAccount(data);
        }
    };

    useEffect(() => {
        getDetailValidUser();
    }, []);

    return (
        <header>
            <nav>
                <div className='left'>
                    <div className='navlogo'>
                        <NavLink to="/"><img src={require('./amazon_PNG25.png')} alt='' /> </NavLink>
                    </div>
                    <div className='nav_Searchbar'>
                        <input type='text' name='' id='' />
                        <div className='search_icon'>
                            <SearchIcon id='search' />
                        </div>
                    </div>
                </div>

                <div className='right'>
                    <div className='nav_btn'>
                        <NavLink to="/login">Sign in</NavLink>
                    </div>
                    <div className='cart_btn'>
                        {
                            account ?
                                <NavLink to="/buynow">
                                    <Badge badgeContent={account.carts.length} color="primary">
                                        <ShoppingCartIcon id='icon' />
                                    </Badge>
                                </NavLink>
                                :
                                <NavLink to="/login">
                                    <Badge badgeContent={0} color="primary">
                                        <ShoppingCartIcon id='icon' />
                                    </Badge>
                                </NavLink>
                        }
                        <p>Cart</p>
                    </div>
                    {
                        account ?
                            <Avatar className='avatar2'>{account.fname[0].toUpperCase()}</Avatar> :
                            <Avatar className='avatar'>U</Avatar>


                    }
                </div>
            </nav>
        </header>
    )
}

export default Navbar
