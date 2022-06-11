import { Link, useLocation} from 'react-router-dom';
import Logo from './Logo';
import { displayAddProfileModal } from '../helpers/modalLogic';

import '../styles/css/Header.css';

const Header = () => {
    const location = useLocation();
    return (
        <header>
            <nav>
                <Logo />
                <Link 
                    to={{ pathname: "/signup", state: { background: location }}}
                    onClick={displayAddProfileModal}
                >
                    Join Community
                </Link>
            </nav>
        </header>
    )
}

export default Header;