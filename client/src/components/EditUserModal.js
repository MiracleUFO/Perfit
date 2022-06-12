import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Logo from './Logo';
import Loader from './Loader';

import { close } from '../helpers/modalLogic';
import baseUrl from '../helpers/baseUrl';


import '../styles/Modal.css';

const EditProfileModal = ({ id, name }) => {
	const initialState = {
        firstName: '',
        lastName: '',
        occupation: '',
        state: '',
        country: '',
        keySkill: '',
        profilePicture: '',
        successText: '',
        failureText: '',
        loading: false
    };

    const [state, setState] = useState({...initialState});

    const closeModal = () => {
        close();
        setState({...initialState});
    };

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    };

    const validate = () => {
        const isEmpty = Object.values(state).every(x => (x === false || x === ''));
        return !isEmpty;
    };

    const handleSubmit = () => {
        const url = baseUrl();
        const valid = validate();

        if (valid) {
            setState({...state, loading: true});

            const {
                firstName,
                lastName,
                occupation,
                country,
                keySkill,
                profilePicture
            } = state;

            const user = {
                firstName,
                lastName,
                occupation,
                state: state.state,
                country,
                keySkill,
                profilePicture
            };

            axios.put(`${url}/api/users/${id}`, user)
            .then(res => {
                const newState = {...initialState, successText: res.data.message};
                setState({...newState});
                setTimeout(() => closeModal(), 1500);
                window.location.reload(false);
            })
            .catch(err => {
                const newState = {...initialState, failureText: err.response.data.error || 'Failed to edit information. Try again.'};
                setState({...newState});
            });
        } else setState({...state, failureText: 'Must edit at least one field'});
    };
    
    return (
        <section 
            id='modal-wrapper-edit-profile'
            onClick={closeModal}
        >
            <div
                id='modal-hidden-edit-profile'
                className='modal-hidden'
                onClick={e => e.stopPropagation()}
            >
                <div className='modal-form'>
                    <section className='brand-wrapper'>
                        <Logo onClick={closeModal} />
                    </section>
        
                    <p className='welcome-text'>
                        Hey {name}! Edit your profile.
                    </p>
        
                    <div className='form'>
                        {state.loading 
                            ?   <div className='loader-container-holder loader-container-edit-holder'>
                                    <Loader />
                                </div>
                            :   ''
                        }
                        <input
                            placeholder='First Name' 
                            name='firstName' 
                            value={state.firstName} 
                            onChange={handleChange}
                        />
                        <input
                            placeholder='Last Name' 
                            name='lastName' 
                            value={state.lastName} 
                            onChange={handleChange}
                        />
                        <div className='input-flex-container'>
                            <input
                                placeholder='Occupation' 
                                name='occupation' 
                                value={state.occupation} 
                                onChange={handleChange}
                            />
                            <input
                                placeholder='Key skill' 
                                name='keySkill' 
                                value={state.keySkill} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className='input-flex-container'>
                            <input 
                                placeholder='State' 
                                name='state' 
                                value={state.state} 
                                onChange={handleChange}
                            />
                            <input
                                placeholder='Country' 
                                name='country' 
                                value={state.country} 
                                onChange={handleChange}
                            />
                        </div>
                        <input
                            placeholder='Profile picture url' 
                            name='profilePicture' 
                            value={state.profilePicture} 
                            onChange={handleChange}
                        />
                        <button onClick={handleSubmit}>Save</button>
                    </div>
        
                    <p>
                        <span className='success-text'>{state.successText}</span>
                        <span className='failure-text'>{state.failureText}</span>
                    </p>
                </div>
        
                <img 
                    className='section-img'
                    src='https://w0.peakpx.com/wallpaper/281/219/HD-wallpaper-helicopter-sky-cloud-flight.jpg'
                    alt='Blue sky and rooftop'
                />

                <p className='close-icon' onClick={closeModal}>
                    X
                </p>
            </div>
        </section>
    );
};

EditProfileModal.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string
};

export default EditProfileModal;