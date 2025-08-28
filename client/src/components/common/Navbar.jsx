import React, { useEffect, useState } from 'react';
import logo from "../../../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath, useLocation } from 'react-router-dom';
import { NavbarLinks } from "../../../../data/navbar-links";
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { IoIosArrowDropdownCircle } from "react-icons/io";

const subLinks = [
    { title: "python", link: "/catalog/python" },
    { title: "web dev", link: "/catalog/web-development" },
];

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();

    const [ssubLinks, setSsubLinks] = useState([]);

    const fetchSublinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("Printing Sublinks result:", result);
            setSsubLinks(result.data.data);
        } catch (error) {
            console.log("Could not fetch the category list");
        }
    };

    useEffect(() => {
        fetchSublinks();
    }, []);

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    // Filter out the Sign Up link from the main navigation
    const filteredNavLinks = NavbarLinks.filter(link => link.title !== "Sign Up");

    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                {/* Logo */}
                <Link to="/">
                    <img src={logo} width={160} height={42} loading='lazy' alt="Logo" />
                </Link>

                {/* Nav Links */}
                <nav className="relative">
                    <ul className='flex gap-x-8 text-richblack-25'>
                        {filteredNavLinks.map((link, index) => (
                            <li key={index} className="group relative">
                                {link.title === "Catalog" ? (
                                    <div className='flex items-center gap-1 hover:text-yellow-25 transition-colors duration-200 cursor-pointer'>
                                        <p className='font-medium'>{link.title}</p>
                                        <IoIosArrowDropdownCircle className="text-sm transition-transform duration-200 group-hover:rotate-180" />

                                        {/* Mega Dropdown */}
                                        <div className='invisible absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 transform space-y-2 rounded-lg bg-richblack-800 p-4 opacity-0 shadow-2xl shadow-richblack-900/50 transition-all duration-300 group-hover:visible group-hover:opacity-100'>
                                            {/* Arrow tip */}
                                            <div className='absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-richblack-800'></div>

                                            {/* Category sections */}
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-richblack-400 px-2">Browse Categories</h4>
                                                {ssubLinks.length ? (
                                                    ssubLinks.map((subLink, index) => (
                                                        <Link
                                                            to={`/catalog/${subLink.name.toLowerCase().replace(/\s+/g, "-")}`}
                                                            key={subLink._id}
                                                            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-richblack-700 ${matchRoute(`/catalog/${subLink.name.toLowerCase().replace(/\s+/g, "-")}`) ? 'text-yellow-50 bg-richblack-700' : 'text-richblack-100'}`}
                                                        >
                                                            <span className="capitalize">{subLink.name}</span>
                                                        </Link>
                                                    ))

                                                ) : (
                                                    <p className="text-center text-richblack-300 py-2 text-sm">No categories available</p>
                                                )}
                                            </div>


                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path} className="group">
                                        <p
                                            className={`font-medium relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-25 after:transition-all after:duration-300 group-hover:after:w-full ${matchRoute(link?.path)
                                                ? "text-yellow-25 after:w-full"
                                                : "text-richblack-25 hover:text-yellow-50"
                                                }`}
                                        >
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Login/Signup/Cart/Profile */}
                <div className='flex gap-x-4 items-center'>
                    {user && user?.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart />
                            {totalItems > 0 && <span>{totalItems}</span>}
                        </Link>
                    )}

                    {token === null && (
                        <>
                            <Link to="/login">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}

                    {token !== null && <ProfileDropDown />}
                </div>
            </div>
        </div>
    );
};

export default Navbar;