import React, { useEffect, useState } from 'react';
import logo from "../../../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath, useLocation } from 'react-router-dom';
import { NavbarLinks } from "../../../../data/navbar-links";
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { IoIosArrowDropdownCircle } from "react-icons/io";

import { FiX } from "react-icons/fi";

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();

    const [subLinks, setSubLinks] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);

    const fetchSublinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            setSubLinks(result.data.data);
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

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsCatalogOpen(false);
    }, [location]);

    // Function to chunk the subLinks array into groups of 3
    const chunkArray = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const chunkedSubLinks = chunkArray(subLinks, 3);

    return (
        <div className='flex h-14 md:h-16 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-900 sticky top-0 z-50'>
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                {/* Logo */}
                <Link to="/" className="flex-shrink-0 z-50">
                    <img src={logo} width={160} height={42} loading='lazy' alt="Logo" className='md:w-40 w-32' />
                </Link>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden flex items-center justify-center w-10 h-10 text-richblack-100 z-50"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>

                {/* Nav Links */}
                <nav className={`absolute md:relative top-full left-0 w-full md:w-auto bg-richblack-900 md:bg-transparent md:flex ${isMobileMenuOpen ? 'flex' : 'hidden'} flex-col md:flex-row pb-4 md:pb-0`}>
                    <ul className='flex flex-col md:flex-row gap-y-4 md:gap-x-8 text-richblack-25 px-5 md:px-0 pt-16 md:pt-0'>
                        {filteredNavLinks.map((link, index) => (
                            <li key={index} className="group relative">
                                {link.title === "Catalog" ? (
                                    <div className='flex flex-col md:flex-row md:items-center gap-1'>
                                        <button 
                                            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                                            className="flex items-center justify-between md:justify-start font-medium hover:text-yellow-25 transition-colors duration-200 cursor-pointer w-full md:w-auto"
                                        >
                                            <p>{link.title}</p>
                                            <IoIosArrowDropdownCircle className={`text-sm transition-transform duration-200 ${isCatalogOpen ? 'rotate-180' : ''} md:group-hover:rotate-180`} />
                                        </button>

                                        {/* Enhanced Mega Dropdown */}
                                        <div className={`md:invisible md:absolute md:left-1/2 md:top-full md:z-50 md:mt-3 w-full md:w-auto min-w-[320px] md:-translate-x-1/2 transform space-y-2 rounded-xl bg-richblack-800 p-6 md:opacity-0 md:shadow-2xl md:shadow-richblack-900/50 transition-all duration-300 md:group-hover:visible md:group-hover:opacity-100 ${isCatalogOpen ? 'block mt-2' : 'hidden md:block'}`}>
                                            {/* Arrow tip for desktop */}
                                            <div className='hidden md:block absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-richblack-800'></div>

                                            {/* Category sections */}
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-yellow-50 px-2 border-b border-richblack-600 pb-2">Browse Categories</h4>
                                                {subLinks.length ? (
                                                    <div className="flex gap-6">
                                                        {chunkedSubLinks.map((chunk, chunkIndex) => (
                                                            <div key={chunkIndex} className="flex flex-col gap-3">
                                                                {chunk.map((subLink) => {
                                                                    const categorySlug = subLink.name
                                                                        .toLowerCase()
                                                                        .trim()
                                                                        .replace(/[^\w\s-]/g, '')
                                                                        .replace(/\s+/g, '-')
                                                                        .replace(/-+/g, '-');
                                                                    
                                                                    const categoryPath = `/catalog/${categorySlug}`;
                                                                    
                                                                    return (
                                                                        <Link
                                                                            to={categoryPath}
                                                                            key={subLink._id}
                                                                            className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-richblack-700 hover:scale-[1.02] hover:shadow-lg ${matchRoute(categoryPath) ? 'text-yellow-50 bg-richblack-700 shadow-lg' : 'text-richblack-100'}`}
                                                                            onClick={() => setIsCatalogOpen(false)}
                                                                        >
                                                                            <div className="w-2 h-2 rounded-full bg-yellow-25 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                                            <span className="capitalize transition-all duration-300 group-hover:translate-x-1">{subLink.name}</span>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-richblack-700 mb-3">
                                                            <svg className="w-6 h-6 text-richblack-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </div>
                                                        <p className="text-richblack-300 text-sm">No categories available at the moment</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`${matchRoute(link.path) ? 'text-yellow-50' : 'text-richblack-25'} hover:text-yellow-50 transition-colors duration-200`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Auth Buttons */}
                    <div className='flex flex-col gap-y-4 px-5 mt-4 md:hidden'>
                        {user === null ? (
                            <div className='flex flex-col gap-y-4 mt-4'>
                                <Link to="/login">
                                    <button className='w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100'>
                                        Log in
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className='w-full rounded-[8px] bg-yellow-50 px-4 py-2 text-richblack-900 font-medium'>
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className='mt-4 space-y-4'>
                                {user?.accountType !== "Instructor" && (
                                    <Link 
                                        to="/dashboard/cart" 
                                        className="flex items-center gap-2 p-2 text-richblack-100 hover:bg-richblack-800 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <AiOutlineShoppingCart className="text-xl" />
                                        <span>My Cart</span>
                                        {totalItems > 0 && (
                                            <span className="ml-auto bg-yellow-50 text-richblack-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {totalItems}
                                            </span>
                                        )}
                                    </Link>
                                )}
                                <ProfileDropDown mobile={true} />
                            </div>
                        )}
                    </div>
                </nav>

                {/* Desktop Login/Signup/Cart/Profile */}
                <div className='hidden md:flex gap-x-4 items-center'>
                    {user && user?.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className="relative p-2 text-richblack-200 hover:text-white transition-colors">
                            <AiOutlineShoppingCart className="text-xl" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-50 text-richblack-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {user === null && (
                        <Link to="/login" className='text-richblack-25'>
                            <button className='rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100'>
                                Log in
                            </button>
                        </Link>
                    )}
                    {user === null && (
                        <Link to="/signup" className='text-richblack-25'>
                            <button className='rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100'>
                                Sign Up
                            </button>
                        </Link>
                    )}
                    {user !== null && <ProfileDropDown />}
                </div>
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-richblack-900 bg-opacity-75 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Navbar;