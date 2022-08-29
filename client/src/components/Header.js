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

        if (sToken && id && !window.location.href.includes('reset'))
            localStorage.setItem('perfit_user_session', sToken);

        if (sessionToken && id && !window.location.href.includes('reset')) 
            url = `${baseUrl()}/api/auth/is-token-valid/${sessionToken}`
        ;   else if (id)
                url = `${baseUrl()}/api/auth/${id}`
            ;   else if (localStorage.getItem('perfit_user_session'))
                    localStorage.removeItem('perfit_user_session')
                ;

        if (window.location.href.includes('reset'))
            window.onbeforeunload = function() {
                window.location.replace(window.location.href.split('reset')[0]);
            }
        ;

        if (!controls.validated)
            if (url)
                axios.get(url)
                    .then(res => {
                        setCurrentUser({ ...currentUser, email: res.data.email, id: res.data.id, verified: res.data.verified });
                        setControls({ ...controls, isVerified: res.data.verified, hasAccount: !!res.data.id, validated: !!res.data.token });
                        !res.token ?? localStorage.setItem('perfit_user_session', res.token);
                    }).catch (e => {
                        console.log(e);
                        setControls({ ...controls, hasAccount: false });
                    })
                ;
            else setControls({...controls, hasAccount: false});
    }, [sToken, currentUser.id]);

    //  Checks if user has added their profile to display avatar in header.
    useEffect(() => {
        const url = baseUrl();
        if (controls.validated && (currentUser.id || currentUser.id === 0)) {
            axios.get(`${url}/api/users/${currentUser.id}`)
                .then(res => {
                    setControls({ ...controls, addedProfile: true });
                    setCurrentUser({ ...currentUser, name: `${res.data.firstName} ${res.data.lastName.charAt(0)}.`, avatar: res.data.profilePicture });
                })
                .catch(e => {
                    console.log(e);
                    setControls({ ...controls, addedProfile: false });
                });
        }
    }, [controls.validated]);

    const logOut = () => {
        const initUser = {
            id: null,
            verified: false,
            email: '',
            name: '',
            avatar: ''
        };
        setCurrentUser({...initUser});
        localStorage.removeItem('perfit_user_session');
        setControls({...controls, validated: false, addedProfile: false, isVerified: false});
    };

    useEffect(() => {
        if (!controls.validated && sToken && localStorage.getItem('perfit_user_session') && !currentUser.id && window.location.href.includes('verify')) {
            window.location.replace(window.location.href.split('verify')[0]);
        }
    }, [controls.validated]);

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
                                            <div className='avatar-container-small'>
                                                <img className='header-avatar' src={currentUser.avatar} alt={`${currentUser.name}'s avatar.`} />
                                            </div>
                                            <div className='user-details-box'>
                                                <span>{currentUser.name}</span>
                                                <Link to={{
                                                    pathname: '/user',
                                                    state: {id: currentUser.id}
                                                }}>Profile</Link>
                                                <button onClick={logOut}>Log out</button>
                                            </div>
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