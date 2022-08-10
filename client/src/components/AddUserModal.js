import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from './Logo';
import Loader from './Loader';

import { close } from '../helpers/modalLogic';
import baseUrl from '../helpers/baseUrl';
import createImageUrl from '../helpers/createImageUrl';
import initialCaps from '../helpers/initialsCaps';

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
        profilePictureUrl: '',
        successText: '',
        failureText: '',
        profilePictureFile: {},
        loading: false,
    };

    const [state, setState] = useState({...initialState});
    const location = useLocation();

    const closeModal = () => {
        close();
        setState({...initialState});
    };

    const handleChange = (e) => {
        let value = e.target.type === 'text' ? initialCaps(e.target.value) : e.target.value;
        setState({...state, [e.target.name]: value});
    };

    const handleFileUploadChange = (e) => {
        setState({...state, profilePictureFile: e.target.files[0], profilePictureUrl: ''});
    };

    const removeFile = () => {
        setState({...state, profilePictureFile: {}});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = baseUrl();
        setState({...state, loading: true});

        const {
            email,
            firstName,
            lastName,
            occupation,
            dob,
            country,
            keySkill,
            profilePictureUrl,
            profilePictureFile,
        } = state;

        try {
            const profilePicture = await createImageUrl(profilePictureUrl ||  profilePictureFile);

            if (profilePicture) {
                const user = {
                    email,
                    firstName,
                    lastName,
                    occupation,
                    dob,
                    state: state.state,
                    country,
                    keySkill,
                    profilePicture,
                };

                axios.post(`${url}/api/users`, user)
                    .then(res => {
                        const newState = {...initialState, successText: res.data.message};
                        setState({...newState});
                    })
                    .catch(err => {
                        const newState = {...initialState, failureText: err.response.data.error || 'Failed to sign up. Try again.'};
                        setState({...newState});
                    });
            }
        } catch(err) {
            setState({...state, profilePictureUrl: '', profilePictureFile: {}, loading: false, failureText: 'Profile picture not valid.'});
        }
    };

    useEffect(() => {
        if (state.successText || state.failureText) {
            const statusSection = document.getElementById('status-text-add-modal');
            statusSection.scrollIntoView({alignToTop: false, behavior: 'smooth'});
        }
        if (state.successText) {
            setTimeout(() => {
                closeModal();
                window.location.reload(false);
            }, 2000);
        }
    }, [state.failureText, state.successText, state.loading]);

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
        
                    <form className='form' onSubmit={handleSubmit}>
                        <div className='form input-container'>
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
                            <input
                                required
                                type='date'
                                placeholder='DOB'
                                title='Pick your date of birth (this is for verification purposes.)'
                                name='dob'
                                value={state.dob} 
                                onChange={handleChange}
                                max={disableFutureDates()}
                            />
                            <div className='input-flex-container'>
                                <input
                                    className='profile-picture-input'
                                    required
                                    type='url'
                                    placeholder='Profile picture url' 
                                    name='profilePictureUrl' 
                                    value={state.profilePictureUrl} 
                                    onChange={handleChange}
                                    disabled={state.profilePictureFile?.name}
                                />
                                {state.profilePictureFile?.name
                                    ?   <span className='file-name'>
                                            {state.profilePictureFile?.name}
                                            <span onClick={removeFile}>x</span>
                                        </span>
                                    : null
                                }
                                <input
                                    id='add-file-btn'
                                    type='file'
                                    hidden
                                    onChange={handleFileUploadChange}
                                    disabled={state.profilePictureUrl}
                                />
                                <label
                                    className='file-label'
                                    htmlFor='add-file-btn'
                                >
                                    Or Choose File
                                </label>
                            </div>
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
                        </div>
                        <button>Join</button>
                    </form>
        
                    <p id='status-text-add-modal'>
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