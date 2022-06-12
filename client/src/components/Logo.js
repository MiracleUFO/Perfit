import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import LogoIcon from '../assets/images/logo-icon.png';
import '../styles/Logo.css';

const Logo = ({ onClick }) => (
    <NavLink 
        to='/'
        className='logo'
        onClick={onClick}
    >
        <img src={LogoIcon} alt='P Logo' className='logo-icon' />
        <h1>perfit</h1>
    </NavLink>
);

Logo.propTypes = {
    onClick: PropTypes.func
};

export default Logo;