import { NavLink } from 'react-router-dom';
import LogoIcon from '../assets/images/logo-icon.png';
import '../assets/css/Logo.css';

const Logo = () => (
    <NavLink to="/" className="logo">
        <img src={LogoIcon} alt="P Logo" className='logo-icon' />
        <h1>perfit</h1>
    </NavLink>
)

export default Logo;