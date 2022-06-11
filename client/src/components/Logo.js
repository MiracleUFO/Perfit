import { NavLink } from 'react-router-dom';
import LogoIcon from '../assets/images/logo-icon.png';
import '../styles/Logo.css';

const Logo = ({ onClick }) => (
    <NavLink 
        to="/"
        className="logo"
        onClick={onClick}
    >
        <img src={LogoIcon} alt="P Logo" className='logo-icon' />
        <h1>perfit</h1>
    </NavLink>
)

export default Logo;