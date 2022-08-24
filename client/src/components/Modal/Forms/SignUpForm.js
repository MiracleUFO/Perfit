import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModalContext } from '../../../context/modalContext';

import baseUrl from '../../../helpers/baseUrl';
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
        { /*setVisible,*/ setType, setLoading } = useModalContext(),
        location = useLocation()
    ;

    /*const closeModal = () => {
        setVisible(false);
        setAuthInfo({...initAuthInfo});
        setControls({...initControls});
    };*/

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
        axios.post(`${url}/api/auth/sign-up`, auth)
            .then(res => {
                setAuthInfo({...initAuthInfo});
                setControls({...initControls, successText: res.data.message});
            })
            .catch(err => setControls({...initControls, failureText: err.response.data.error || 'Failed to sign up. Try again.'}))
        ;
    };

    useEffect(() => setLoading(controls.loading), [controls.loading]);

     //  Scrolls to control text at bottom of modal
     /*useEffect(() => {
        if (controls.successText || controls.failureText) {
            document.getElementById('status-text-signup-modal').scrollIntoView({alignToTop: false, behavior: 'smooth'});
        }
        
        if (controls.successText) {
            setTimeout(() => {
                closeModal();
                window.location.reload(false);
            }, 2000);
        }
    }, [controls.failureText, controls.successText, controls.loading]);*/

    return (
        <div className='animate__animated animate__backInLeft'>
            <p className='welcome-text'>
                Hey Stranger! Join our community.
            </p>

            <form className='form' onSubmit={handleSubmit}>
                <div className='form input-container'>
                    {controls.loading 
                        ?   <div className='loader-container-holder loader-container-add-holder'>
                                <Loader />
                            </div>
                        :   ''
                    }
                    <input
                        required
                        placeholder='Email Address'
                        name='email'
                        type='email' 
                        value={authInfo.email}
                        onChange={handleChange}
                    />
                    <input
                        required
                        placeholder='Password'
                        name='password'
                        type='password' 
                        value={authInfo.password}
                        onChange={handleChange}
                    />
                    <input
                        required
                        placeholder='Confirm Password'
                        name='confirmPass'
                        type='password' 
                        value={authInfo.confirmPass}
                        onChange={handleChange}
                    />
                    <input
                        required
                        type='date'
                        placeholder='Date of Birth'
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