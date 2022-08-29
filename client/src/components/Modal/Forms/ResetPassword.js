import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModalContext } from '../../../context/modalContext';

import baseUrl from '../../../helpers/baseUrl';
import { isMatch, passwordStrengthVal, passwordDiversity } from '../../../helpers/passwordValidator';

import Loader from '../../Loader';

import 'animate.css';

const ResetPasswordForm = () => {
    const initAuthInfo = {
        password: '',
        confirmPass: ''
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
        location = useLocation(),
        search = location.search,
        token = new URLSearchParams(search).get('rToken')
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
                password,
                confirmPass
            } = authInfo,
            auth = {
                password,
                confirmPass
            }
        ;
        if (
            (password === confirmPass) && 
            (passwordStrengthVal(password) === 'strong' || passwordStrengthVal(password) === 'medium')
        )
            axios.post(`${url}/api/auth/reset-password/${token}`, auth)
                .then(res => {
                    setAuthInfo({...initAuthInfo});
                    setControls({...initControls, successText: res.data.message});
                    setType('sign-in');
                })
                .catch(err => setControls({...initControls, failureText: err.response.data.error || 'Failed to reset. Try again.'}))
            ;
    };

    useEffect(() => setLoading(controls.loading), [controls.loading]);

    //  Scrolls to control bottom of modal and switches to verification modal when sign up is complete
    useEffect(() => {
        if (controls.successText || controls.failureText)
            document.getElementById('status-text-reset-modal').scrollIntoView({alignToTop: false, behavior: 'smooth'})
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
                Reset your password.
            </p>

            <form className='form' onSubmit={handleSubmit}>
                {controls.loading 
                    ?   <div className='loader-container-holder loader-container-signup-holder'>
                            <Loader />
                        </div>
                    :   null
                }
                <div className='form input-container'>
                    <>
                        <div className='input-flex-container'>
                            <input
                                required
                                className='password-input'
                                placeholder='Password'
                                name='password'
                                type={passwordType}
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
                        {(authInfo.password.length < 8 && authInfo.password) || passwordDiversity(authInfo.password) ?
                            <span className='failure-text info-text'>
                                {authInfo.password.length < 8 && authInfo.password ?
                                    <>**{8 - authInfo.password.length} more characters</>
                                :   null
                                }
                                {passwordDiversity(authInfo.password) ?
                                    <>&nbsp;**add {passwordDiversity(authInfo.password)}</>
                                :   null
                            }
                            </span>
                        :   null
                        }
                    </>
                    <>
                        <input
                            required
                            placeholder='Confirm Password'
                            name='confirmPass'
                            type={passwordType}
                            value={authInfo.confirmPass}
                            onChange={handleChange}
                        />
                        {authInfo.confirmPass ? <span className='failure-text info-text'>{isMatch(authInfo.password, authInfo.confirmPass)}</span> : null}
                    </>
                </div>
                <div className='checkbox-holder'>
                    <input
                        type='checkbox'
                        id='password-toggler'
                        onClick={(e) => togglePasswordsVisibility(e.target.checked)}
                    />
                    <label htmlFor='password-toggler'>Show Password</label>
                </div>
                <button>Reset</button>
            </form>

            {controls.successText || controls.failureText ?
                <p id='status-text-reset-modal' className='status-text'>
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

export default ResetPasswordForm;