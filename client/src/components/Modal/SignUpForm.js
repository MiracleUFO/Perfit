import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModalContext } from '../../context/modalContext';
import disableFutureDates from '../../helpers/disableFutureDates';

import Loader from '../Loader';
import 'animate.css';

const SignUpForm = () => {
    const initUserInfo = {
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
        [controls, /*setControls*/] = useState({...initControls}),
        [userInfo, /*setUserInfo*/] = useState({...initUserInfo}),
        { setType } = useModalContext(),
        location = useLocation()
    ;

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleChange = (e) => {
        console.log(e.target.value);
    };

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
                        value={userInfo.email}
                        onChange={handleChange}
                    />
                    <input
                        required
                        placeholder='Password'
                        name='password'
                        type='password' 
                        value={userInfo.password}
                        onChange={handleChange}
                    />
                    <input
                        required
                        placeholder='Confirm Password'
                        name='confirmPass'
                        type='password' 
                        value={userInfo.email}
                        onChange={handleChange}
                    />
                    <input
                        required
                        type='date'
                        placeholder='DOB'
                        title='Pick your date of birth (this is for verification purposes.)'
                        name='dob'
                        value={userInfo.dob} 
                        onChange={handleChange}
                        max={disableFutureDates()}
                    />
                </div>
                <button>Join</button>
            </form>

            <p id='status-text-signup-modal'>
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