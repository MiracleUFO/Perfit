import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Logo from './Logo';
import Loader from './Loader';

import { close } from '../helpers/modalLogic';
import isEmpty from '../helpers/validate';
import baseUrl from '../helpers/baseUrl';
import createImageUrl from '../helpers/createImageUrl';
import initialCaps from '../helpers/initialsCaps';

import '../styles/Modal.css';

const EditProfileModal = ({ id, name }) => {
	const initialState = {
        firstName: '',
        lastName: '',
        occupation: '',
        state: '',
        country: '',
        keySkill: '',
        profilePictureUrl: '',
        profilePictureFile: {},
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
        let value = e.target.type === 'text' ? initialCaps(e.target.value) : e.target.value;
        setState({...state, [e.target.name]: value});
    };

    const handleFileUploadChange = (e) => {
        setState({...state, profilePictureFile: e.target.files[0], profilePictureUrl: ''});
    };

    const removeFile = () => {
        setState({...state, profilePictureFile: {}});
    };
    
    const handleSubmit = async () => {
        const url = baseUrl();
        const valid = isEmpty(state);

        if (valid) {
            setState({...state, loading: true});

            const {
                firstName,
                lastName,
                occupation,
                country,
                keySkill,
                profilePictureUrl,
                profilePictureFile
            } = state;

            try {
                const profilePicture = (profilePictureUrl || JSON.stringify(profilePictureFile) !== '{}')
                    ?   await createImageUrl(profilePictureUrl ||  profilePictureFile)
                    :   ''
                ;

                console.log(profilePicture);

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
                    .then(() => {
                        const newState = {...initialState, successText: 'User info edited successfully.'};
                        setState({...newState});
                    })
                    .catch(err => {
                        const newState = {...initialState, failureText: err.response.data.error || 'Failed to edit information. Try again.'};
                        setState({...newState});
                    })
                ;
            } catch (err) {
                setState({...state, profilePictureUrl: '', profilePictureFile: {}, loading: false, failureText: 'Profile picture not valid.'});
            }
        } else setState({...state, failureText: 'Must edit at least one field'});
    };

    useEffect(() => {
        if (state.successText || state.failureText) {
            document.getElementById('status-text-edit-modal').scrollIntoView({alignToTop: false, behavior: 'smooth'});
        }
        if (state.successText) {
            setTimeout(() => {
                closeModal();
                window.location.reload(false);
            }, 2000);
        }
    }, [state.failureText, state.successText, state.loading]);
    
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
                        <div className='form input-container'>
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
                                    id='edit-file-btn'
                                    type='file'
                                    hidden
                                    onChange={handleFileUploadChange}
                                />
                                <label
                                    className='file-label'
                                    htmlFor='edit-file-btn'
                                >
                                    Or Choose File
                                </label>
                            </div>
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
                        </div>
                        <button onClick={handleSubmit}>Save</button>
                    </div>
        
                    <p id='status-text-edit-modal'>
                        <span className='success-text'>{state.successText}</span>
                        <span className='failure-text'>{state.failureText}</span>
                    </p>
                </div>
        
                <img 
                    className='section-img'
                    src='https://w0.peakpx.com/wallpaper/281/219/HD-wallpaper-helicopter-sky-cloud-flight.jpg'
                    alt='Blue sky and helicopter'
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