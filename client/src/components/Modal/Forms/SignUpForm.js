import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModalContext } from '../../../context/modalContext';
import { useUserContext } from '../../../context/userContext';

import baseUrl from '../../../helpers/baseUrl';
import { isMatch, passwordStrengthVal } from '../../../helpers/passwordValidator';
import disableFutureDates from '../../../helpers/disableFutureDates';

import Loader from '../../Loader';

import 'animate.css';

const SignUpForm = () => {
    const initAuthInfo = {
        email: '',
        password: '',
        confirmPass: '',
        dob: ''
    };
    const initControls = {
        successText: '',
        failureText: '',
        loading: false,
    };
    const 
        [controls, setControls] = useState({...initControls}),
        [authInfo, setAuthInfo] = useState({...initAuthInfo}),
        { setType, setLoading } = useModalContext(),
        { currentUser, setCurrentUser } = useUserContext(),
        location = useLocation()
    ;

    const handleChange = (e) => setAuthInfo({...authInfo, [e.target.name]: e.target.value});

    const handleSubmit = (e) => {
        e.preventDefault();
        setControls({...controls, loading: true});
        const 
            url = baseUrl(),
            {
                email,
                password,
                confirmPass,
                dob
            } = authInfo,
            auth = {
                email,
                password,
                confirmPass,
                dob
            }
        ;
        if (
            (password === confirmPass) && 
            (passwordStrengthVal(password) === 'strong' || passwordStrengthVal(password) === 'medium')
        ) {
            localStorage.removeItem('perfit_user_id');
            axios.post(`${url}/api/auth/sign-up`, auth)
                .then(res => {
                    setAuthInfo({...initAuthInfo});
                    setControls({...initControls, successText: res.data.message});
                    localStorage.setItem('perfit_user_id', res.data.id);
                    setCurrentUser({...currentUser, id: res.data.id});
                })
                .catch(err => setControls({...initControls, failureText: err.response.data.error || 'Failed to sign up. Try again.'}))
            ;
        }
    };

    useEffect(() => setLoading(controls.loading), [controls.loading]);

     //  Scrolls to control bottom of modal and switches to verification modal when sign up is complete
     useEffect(() => {
        if (controls.successText || controls.failureText) {
            document.getElementById('status-text-signup-modal').scrollIntoView({alignToTop: false, behavior: 'smooth'});
        }

        if (controls.successText) setTimeout(() => setType('verify-message'), 2500);
    }, [controls.failureText, controls.successText, controls.loading]);

    return (
        <div className='animate__animated animate__backInLeft form-holder'>
            <p className='welcome-text'>
                Hey Stranger! Join our community.
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
                            className='password-input'
                            placeholder='Password'
                            name='password'
                            type='password'
                            minLength='8'
                            maxLength='20'
                            value={authInfo.password}
                            onChange={handleChange}
                        />
                        {
                            passwordStrengthVal(authInfo.password) && 
                            passwordStrengthVal(authInfo.password) !== 'medium' ? 
                                <span
                                    className='pass-strenght-info' 
                                    style={{
                                        backgroundColor: passwordStrengthVal(authInfo.password) === 'strong' ? 'var(--chrome-green)' : 'var(--failure-red)'
                                    }}
                                >
                                    {passwordStrengthVal(authInfo.password)}
                                </span> 
                            :   null
                        }
                    </div>
                    <>
                        <input
                            required
                            placeholder='Confirm Password'
                            name='confirmPass'
                            type='password' 
                            value={authInfo.confirmPass}
                            onChange={handleChange}
                        />
                        {authInfo.confirmPass ? <span className='failure-text info-text'>{isMatch(authInfo.password, authInfo.confirmPass)}</span> : null}
                    </>
                    <input
                        required
                        type='date'
                        placeholder='Birth Date'
                        title='Pick your date of birth (this is for verification purposes.)'
                        name='dob'
                        value={authInfo.dob} 
                        onChange={handleChange}
                        max={disableFutureDates()}
                    />
                </div>
                <button>Join</button>
            </form>

            <p id='status-text-signup-modal' className='status-text'>
                <span className='success-text'>{controls.successText}</span>
                <span className='failure-text'>{controls.failureText}</span>
            </p>

            <p className='have-account-text'>
                Already have account?
                <Link
                    to={{pathname: '/', state: {background: location}}}
                    onClick={() => setType('sign-in')}
                >
                    &nbsp;Sign In
                </Link>
            </p>
        </div>
    );
};

export default SignUpForm;