import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from './Logo';
import Loader from './Loader';

import { close } from '../helpers/modalLogic';
import baseUrl from '../helpers/baseUrl';

import '../styles/Modal.css';

const AddProfileModal = () => {
    const initialState = {
        email: '',
        firstName: '',
        lastName: '',
        occupation: '',
        dob: '',
        state: '',
        country: '',
        keySkill: '',
        profilePicture: '',
        successText: '',
        failureText: '',
        loading: false
    };

    const [state, setState] = useState({...initialState});

    const location = useLocation();

    const closeModal = () => {
        close();
        setState({...initialState});
    };

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    };

    const handleSubmit = () => {
        setState({...state, loading: true});

        const {
            email,
            firstName,
            lastName,
            occupation,
            dob,
            country,
            keySkill,
            profilePicture
        } = state;

        const user = {
            email,
            firstName,
            lastName,
            occupation,
            dob,
            state: state.state,
            country,
            keySkill,
            profilePicture
        };

        const url = baseUrl();
        axios.post(`${url}/api/users`, user)
            .then(res => {
                const newState = {...initialState, successText: res.data.message};
                setState({...newState});
                setTimeout(() => closeModal(), 1500);
            })
            .catch(err => {
                const newState = {...initialState, failureText: err.response.data.error || 'Failed to sign up. Try again.'};
                setState({...newState});
            });
    };

    const disableFutureDates = () => {
        const today = new Date();
        const year = today.getFullYear();
        let date, month;
        date = today.getDate();
        month = today.getMonth() + 1;

        if (month < 9) {
            month = `0${month}`;
        }
        if (date < 9) {
            date = `0${date}`;
        }
        
        const formattedDate = `${year}-${month}-${date}`;
        return formattedDate;
    };
    
    return (
        <section id='modal-wrapper-add-profile' onClick={closeModal}>
            <div id='modal-hidden-add-profile' className='modal-hidden' onClick={e => e.stopPropagation()}>
                <div className='modal-form'>
                    <section className='brand-wrapper'>
                        <Logo onClick={closeModal} />
                    </section>
        
                    <p className='welcome-text'>
                        Hey Stranger! Join our community.
                    </p>
        
                    <div className='form'>
                        {state.loading 
                            ?   <div className='loader-container-holder loader-container-add-holder'>
                                    <Loader />
                                </div>
                            :   ''
                        }
                        <input
                            required
                            placeholder='First Name' 
                            name='firstName' 
                            value={state.firstName} 
                            onChange={handleChange}
                        />
                        <input
                            required
                            placeholder='Last Name' 
                            name='lastName' 
                            value={state.lastName} 
                            onChange={handleChange}
                        />
                        <input
                            required
                            placeholder='Email Address'
                            name='email'
                            type='email' 
                            value={state.email}
                            onChange={handleChange}
                        />
                        <div className='input-flex-container'>
                            <input
                                required
                                placeholder='Occupation' 
                                name='occupation' 
                                value={state.occupation} 
                                onChange={handleChange}
                            />
                            <input
                                required
                                placeholder='Key skill' 
                                name='keySkill' 
                                value={state.keySkill} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className='input-flex-container'>
                            <input 
                                required
                                placeholder='State' 
                                name='state' 
                                value={state.state} 
                                onChange={handleChange}
                            />
                            <input
                                required
                                placeholder='Country' 
                                name='country' 
                                value={state.country} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className='input-flex-container'>
                            <input
                                required
                                type='date'
                                placeholder='DOB'
                                title='Pick your date of birth'
                                name='dob'
                                value={state.dob} 
                                onChange={handleChange}
                                max={disableFutureDates()}
                            />
                            <input
                                required 
                                placeholder='Profile picture url' 
                                name='profilePicture' 
                                value={state.profilePicture} 
                                onChange={handleChange}
                            />
                        </div>
                        <button onClick={handleSubmit}>Join</button>
                    </div>
        
                    <p>
                        <span className='success-text'>{state.successText}</span>
                        <span className='failure-text'>{state.failureText}</span>
                    </p>
        
                    <p className='have-account-text'>
                        Already have account?
                        <Link 
                            to={{pathname: '/', state: {background: location}}}
                            onClick={closeModal}
                        >
                            &nbsp;To Home
                        </Link>
                    </p>
                </div>
        
                <img 
                    className='section-img'
                    src='https://www.publicbooks.org/wp-content/uploads/2022/05/arthur-mazi-a8CxRWIu8yw-unsplash-e1651170357711-810x522.jpg'
                    alt='Blue sky and rooftop'
                />

                <p className='close-icon' onClick={closeModal}>
                    X
                </p>
            </div>
        </section>
    );
};

export default AddProfileModal;