import React, { useContext, useEffect, useState } from 'react';
import "./navbar.css";
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import { NavLink, useNavigate } from 'react-router-dom';
import { LoginContext } from '../context/ContextProvider';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import LeftHeader from './LeftHeader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

//material.ui
const Navbar = () => {

    const { account, setAccount } = useContext(LoginContext);
    // console.log(account);

    const [text, setText] = useState("");
    const [listopen, setListopen] = useState(true);

    const { products } = useSelector(state => state.getproductsdata);

    const [dropopen, setDropopen] = useState(false);

    const history = useNavigate("");

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


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
    const logoutuser = async () => {
        const res = await fetch("/logout", {
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
            toast.success("Logged out!", {
                position: "top-center",
            });
            setAccount(false);
            history("/");
        }
    };

    const handleopen = () => {
        setDropopen(true);
    }
    const handleclose = () => {
        setDropopen(false);
    }

    const getText = (item) => {
        setText(item);
        setListopen(false);
    }

    useEffect(() => {
        getDetailValidUser();
    }, []);



    return (
        <header>
            <nav>
                <div className='left'>
                    {/* App bar */}
                    <IconButton className='hamburgur' onClick={handleopen}>
                        <MenuIcon style={{ color: "#fff" }} />
                    </IconButton>

                    {/* Drawer */}
                    <Drawer open={dropopen} onClose={handleclose}>
                        <LeftHeader logclose={handleclose} logout={logoutuser} />
                    </Drawer>

                    <div className='navlogo'>
                        <NavLink to="/"><img src={require('./amazon_PNG25.png')} alt='' /> </NavLink>
                    </div>
                    <div className='nav_Searchbar'>
                        <input type='text' name='' id=''
                            onChange={(e) => getText(e.target.value)}
                            placeholder='search your products'
                        />
                        <div className='search_icon'>
                            <SearchIcon id='search' />
                        </div>
                        {/* search filter */}
                        {
                            text &&
                            <List className='extrasearch' hidden={listopen}>{
                                products.filter((product) => product.title.longTitle.toLowerCase().includes(text.toLowerCase())).map((product) => (
                                    <ListItem>
                                        <NavLink to={`/getproductsone/${product.id}`} onClick={() => setListopen(true)}>
                                            {product.title.longTitle}
                                        </NavLink>
                                    </ListItem>
                                ))
                            }</List>
                        }

                    </div>
                </div>

                <div className='right'>
                    <div className='nav_btn'>
                        <NavLink to="/login">Sign in</NavLink>
                    </div>

                    {
                        account ?
                            <NavLink to="/buynow">
                                <div className='cart_btn'>
                                    <Badge badgeContent={account.carts.length} color="primary">
                                        <ShoppingCartIcon id='icon' />
                                    </Badge>
                                    <p>Cart</p>
                                </div>
                            </NavLink>
                            :
                            <NavLink to="/login">
                                <div className='cart_btn'>
                                    <Badge badgeContent={0} color="primary">
                                        <ShoppingCartIcon id='icon' />
                                    </Badge>
                                    <p>Cart</p>
                                </div>
                            </NavLink>
                    }
                    {
                        account ?
                            <Avatar
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                className='avatar2'>
                                {account.fname[0].toUpperCase()}</Avatar> :
                            <Avatar id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                className='avatar'>U</Avatar>
                    }
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >

                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        {
                            account ?
                                <MenuItem onClick={() => { handleClose(); logoutuser(); }}><LogoutIcon style={{ fontSize: 16, marginRight: 3 }} />Logout</MenuItem> : <></>
                        }
                    </Menu>
                    <ToastContainer />
                </div>
            </nav>
        </header>
    )
}

export default Navbar
