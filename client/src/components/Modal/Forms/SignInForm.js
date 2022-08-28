import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModalContext } from '../../../context/modalContext';

import baseUrl from '../../../helpers/baseUrl';

import Loader from '../../Loader';

import 'animate.css';

const SignInForm = () => {
    const initAuthInfo = {
        email: '',
        password: ''
    };
    const initControls = {
        successText: '',
        failureText: '',
        loading: false,
    };
    const 
        [controls, setControls] = useState({...initControls}),
        [authInfo, setAuthInfo] = useState({...initAuthInfo}),
        [passwordType, setPasswordType] = useState('password'),
        { setType, setLoading, setVisible } = useModalContext(),
        location = useLocation()
    ;

    const togglePasswordsVisibility = (checked) => setPasswordType(checked ? 'text' : 'password');

    // Closes the modal when actions are finished on form
    const closeModal = () => {
        setVisible(false);
        setAuthInfo({...initAuthInfo});
        setControls({...initControls});
    };

    const handleChange = (e) => setAuthInfo({...authInfo, [e.target.name]: e.target.value});

    const handleSubmit = (e) => {
        e.preventDefault();
        setControls({...controls, loading: true});
        const 
            url = baseUrl(),
            {
                email,
                password,
            } = authInfo,
            auth = {
                email,
                password
            }
        ;
        axios.post(`${url}/api/auth/sign-in`, auth)
            .then(res => {
                setAuthInfo({...initAuthInfo});
                setControls({...initControls, successText: res.data.message});
                
                window.localStorage.setItem('perfit_user_id', res.data.id);
                window.localStorage.setItem('perfit_user_session', res.data.token);
                window.dispatchEvent(new Event('storage'));
            })
            .catch(err => setControls({...initControls, failureText: err.response.data.error || 'Failed to sign up. Try again.'}))
        ;
    };

    useEffect(() => setLoading(controls.loading), [controls.loading]);

     //  Scrolls to control bottom of modal and switches to verification modal when sign up is complete
     useEffect(() => {
        if (controls.successText || controls.failureText)
            document.getElementById('status-text-signin-modal').scrollIntoView({alignToTop: false, behavior: 'smooth'})
        ;

        if (controls.successText)
            setTimeout(() => {
                closeModal();
            }, 2000)
        ;
    }, [controls.failureText, controls.successText, controls.loading]);

    return (
        <div className='animate__animated animate__backInLeft form-holder'>
            <p className='welcome-text'>
                Hey Stranger! Sign in here.
            </p>

            <form className='form' onSubmit={handleSubmit}>
                {controls.loading 
                    ?   <div className='loader-container-holder loader-container-signup-holder'>
                            <Loader />
                        </div>
                    :   null
                }
                <div className='form input-container'>
                    <input
                        required
                        placeholder='Email Address'
                        name='email'
                        type='email' 
                        value={authInfo.email}
                        onChange={handleChange}
                    />
                    <div className='input-flex-container'>
                        <input
                            required
                            placeholder='Password'
                            className='password-input'
                            name='password'
                            type={passwordType}
                            minLength='8'
                            maxLength='20'
                            value={authInfo.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='checkbox-holder'>
                    <input type='checkbox' id='password-toggler' onClick={(e) => togglePasswordsVisibility(e.target.checked)} />
                    <label htmlFor='password-toggler'>Show Password</label>
                </div>
                <button>Sign In</button>
            </form>

            {controls.successText || controls.failureText ?
                <p id='status-text-signup-modal' className='status-text'>
                    <span className='success-text'>{controls.successText}</span>
                    <span className='failure-text'>{controls.failureText}</span>
                </p>
            :   null
            }

            <p className='have-account-text'>
                Don&apos;t have an account?
                <Link
                    to={{pathname: '/', state: {background: location}}}
                    onClick={() => setType('sign-up')}
                >
                    &nbsp;Sign Up
                </Link>
            </p>
        </div>
    );
};

export default SignInForm;