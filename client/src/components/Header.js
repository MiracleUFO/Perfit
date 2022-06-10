import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import '../assets/css/Header.css';

const Header = () => {
    return (
        <header>
            <nav>
                <Logo />
                <NavLink to="/add-profile">
                    Join Community
                </NavLink>
            </nav>
        </header>
    )
}

export default Header;