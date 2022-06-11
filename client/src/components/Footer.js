import React from 'react';
import Logo from './Logo';
import '../styles/css/Footer.css';

const Footer = () => {
	return (
		<footer>
            <div>
                <h1>Sign up for our newsletter</h1>
                <div className='input-container'>
                    <input placeholder='Enter email address' />
                    <button>Sign up</button>
                </div>
            </div>
            <Logo />
		</footer>
	)
}

export default Footer;