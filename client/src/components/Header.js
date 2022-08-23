import { Link, useLocation} from 'react-router-dom';
import { useModalContext } from '../context/modalContext';

import Logo from './Logo';

import '../styles/Header.css';

const Header = () => {
    const 
        location = useLocation(),
        { setType, setVisible } = useModalContext()
    ;
        
    const displayAddUserForm = () => {
        setVisible(true);
        setType('sign-up');
    };

    return (
        <header>
            <nav>
                <Logo />
                <Link 
                    to={{ pathname: '', state: { background: location }}}
                    onClick={displayAddUserForm}
                >
                    Join Community
                </Link>
            </nav>
        </header>
    );
};

export default Header;