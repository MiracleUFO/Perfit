import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModalContext } from '../../context/modalContext';

import Loader from '../Loader';

import baseUrl from '../../helpers/baseUrl';
import createImageUrl from '../../helpers/createImageUrl';
import initialCaps from '../../helpers/initialsCaps';

const AddProfileForm = () => {
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

    const
        [state, setState] = useState({...initialState}),
        { setVisible, setType, setLoading } = useModalContext(),
        location = useLocation()
    ;

    const closeModal = () => {
        setVisible(false);
        setState({...initialState});
    };

    const handleChange = (e) => {
        let value = e.target.type === 'text' ? initialCaps(e.target.value) : e.target.value;
        setState({...state, [e.target.name]: value});
    };

    const handleFileUploadChange = (e) => {
        setState({...state, profilePictureFile: e.target.files[0], profilePictureUrl: ''});
        e.target.value = '';
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
            console.log(typeof profilePicture, profilePicture);

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

    useEffect(() => setLoading(state.loading), [state.loading]);

    /*const disableFutureDates = () => {
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
    };*/
    
    return (
        <>
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
                    {/*<input
                        required
                        type='date'
                        placeholder='DOB'
                        title='Pick your date of birth (this is for verification purposes.)'
                        name='dob'
                        value={state.dob} 
                        onChange={handleChange}
                        max={disableFutureDates()}
                    /> add to auth sign up (don't allow less than 13)*/}
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
                        {!state.profilePictureUrl ?
                            <>
                                <input
                                    id='add-file-btn'
                                    type='file'
                                    hidden
                                    onChange={handleFileUploadChange}
                                />
                                <label
                                    className='file-label'
                                    htmlFor='add-file-btn'
                                >
                                    Or Choose File
                                </label>
                            </>
                        : null
                    }
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
                    onClick={() => setType('sign-in')}
                >
                    &nbsp;Sign In
                </Link>
            </p>
        </>
    );
};

export default AddProfileForm;