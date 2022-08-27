import axios from 'axios';
import { string } from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useLocation} from 'react-router-dom';

import { useModalContext } from '../context/modalContext';
import { useUserContext } from '../context/userContext';

import baseUrl from '../helpers/baseUrl';

import Logo from './Logo';
import '../styles/Header.css';

const Header = ({ sToken }) => {
    const
        { currentUser, setCurrentUser } = useUserContext(),
        [controls, setControls] = useState({
            hasAccount: false,
            validated: false,
            addedProfile: false,
            isVerified: currentUser.verified
        }),
        location = useLocation(),
        { setType, setVisible } = useModalContext()
    ;
        
    const displayAddUserForm = (type) => {
        setVisible(true);
        setType(type);
    };

    useEffect(() => {
        let url = '';
        const 
            sessionToken = sToken || localStorage.getItem('perfit_user_session'),
            id = localStorage.getItem('perfit_user_id')
        ;

        if (sessionToken) 
            url = `${baseUrl()}/api/auth/is-token-valid/${sessionToken}`
        ;   else if (id)
                url = `${baseUrl()}/api/auth/${id}`
            ;

        console.log(currentUser, url, controls);

        if (url)
            axios.get(url)
                .then(res => {
                    console.log(res);

                    setCurrentUser({ email: res.data.email, id: res.data.id, verified: res.data.verified });
                    setControls({ ...controls, isVerified: res.data.verified, hasAccount: !!res.data.id, validated: !!res.data.token });
                    !res.token ?? localStorage.setItem('perfit_user_session', res.token);
                }).catch (e => {
                    console.log(e);
                    setControls({...controls, hasAccount: false});
                });
        else setControls({...controls, hasAccount: false});
    }, [sToken, currentUser.id]);

    //  Check if user has added profile already.
    useEffect(() => {
        const url = baseUrl();
        if (controls.validated && (currentUser.id || currentUser.id === 0)) {
            axios.get(`${url}/api/users/${currentUser.id}`)
                .then(res => {
                    setCurrentUser({...currentUser, name: `${res.data.firstName} ${res.data.lastName.charAt(0)}.`, avatar: res.data.profilePicture});
                    setControls({...controls, addedProfile: true});
                })
                .catch(e => {
                    console.log(e);
                    setControls({...controls, addedProfile: false});
                });
        }
    }, [controls.validated, currentUser.id]);

    return (
        <header>
            <nav>
                <Logo />
                <>
                    {controls.hasAccount ?
                        controls.isVerified ?
                            controls.validated ?
                                controls.addedProfile ?
                                    <div className='header-user'>
                                        <div>
                                            <img src={currentUser.profilePicture} alt={`${currentUser.name}'s avatar.`} />
                                            <span>{currentUser.name}</span>
                                        </div>
                                    </div>
                                :   <Link 
                                        to={{ pathname: '', state: { background: location }}}
                                        onClick={() => displayAddUserForm('add-user')}
                                    >
                                        Add Profile
                                    </Link>
                            :   <Link 
                                    to={{ pathname: '', state: { background: location }}}
                                    onClick={() => displayAddUserForm('sign-in')}
                                >
                                    Sign In
                                </Link>
                        :   <Link 
                                to={{ pathname: '', state: { background: location }}}
                                onClick={() => displayAddUserForm('verify-message')}
                            >
                                Verify Email
                            </Link>
                    :   <Link 
                            to={{ pathname: '', state: { background: location }}}
                            onClick={() => displayAddUserForm('sign-up')}
                        >
                            Join Community
                        </Link>
                    }
                </>
            </nav>
        </header>
    );
};


Header.propTypes = {
    sToken: string
};

export default Header;