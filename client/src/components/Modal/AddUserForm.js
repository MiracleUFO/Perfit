import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModalContext } from '../../context/modalContext';
import { useUserContext } from '../../context/userContext';

import Loader from '../Loader';

import baseUrl from '../../helpers/baseUrl';
import createImageUrl from '../../helpers/createImageUrl';
import initialCaps from '../../helpers/initialsCaps';
import isValidImageSet from '../../helpers/isValidImageSet';

const AddProfileForm = () => {
    const initUserInfo = {
        email: '',
        firstName: '',
        lastName: '',
        occupation: '',
        dob: '',
        state: '',
        country: '',
        keySkill: '',
        profilePictureUrl: '',
        profilePictureFile: {}
    };
    const initControls = {
        successText: '',
        failureText: '',
        pfpWarningText: '',
        loading: false,
    };
    const
        [userInfo, setUserInfo] = useState({...initUserInfo}),
        [controls, setControls] = useState({...initControls}),
        { setVisible, setType, setLoading } = useModalContext(),
        { setJustAdded } = useUserContext(),
        location = useLocation()
    ;

    // Closes the modal when actions are finished on form
    const closeModal = () => {
        setVisible(false);
        setUserInfo({...initUserInfo});
        setControls({...initControls});
    };

    //  Handles input changes besides file uploads
    const handleChange = (e) => {
        let value = e.target.type === 'text' ? initialCaps(e.target.value) : e.target.value;
        setUserInfo({...userInfo, [e.target.name]: value});
    };

    //  Handles file change
    const handleFileUploadChange = (e) => {
        setUserInfo({...userInfo, profilePictureFile: e.target.files[0], profilePictureUrl: ''});
        e.target.value = '';
    };

    const removeFile = () => {
        setUserInfo({...userInfo, profilePictureFile: {}});
    };

    //  Checks if user avatar is in correct format (png,...,jpeg)
    useEffect(() => {
        const { profilePictureUrl, profilePictureFile } = userInfo;

        const text = isValidImageSet(profilePictureUrl, profilePictureFile) ? '' : '*Please choose a still image (jpegs or png.)';
        setControls({...controls, pfpWarningText: text});
    }, [userInfo.profilePictureUrl, userInfo.profilePictureFile]);

    //  Validates and submits user info
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = baseUrl();

        setUserInfo({...userInfo});
        setControls({...controls, loading: true});
        setJustAdded(false);

        const {
            email,
            firstName,
            lastName,
            occupation,
            dob,
            state,
            country,
            keySkill,
            profilePictureUrl,
            profilePictureFile,
        } = userInfo;

        try {
            const profilePicture = await createImageUrl(profilePictureUrl ||  profilePictureFile);

            if (profilePicture) {
                const user = {
                    email,
                    firstName,
                    lastName,
                    occupation,
                    dob,
                    state,
                    country,
                    keySkill,
                    profilePicture,
                };

                axios.post(`${url}/api/users`, user)
                    .then(res => {
                        setJustAdded(true);
                        setUserInfo({...initUserInfo});
                        setControls({...initControls, successText: res.data.message});
                    })
                    .catch(err => {
                        setUserInfo({...initUserInfo});
                        setControls({...initControls, failureText: err.response.data.error || 'Failed to sign up. Try again.'});
                    });
            }
        } catch {
            setUserInfo({...userInfo, profilePictureUrl: '', profilePictureFile: {}});
            setControls({loading: false, failureText: 'Profile picture not valid.'});
        }
    };

    //  Scrolls to control text at bottom of modal
    useEffect(() => {
        if (controls.successText ||controls.failureText) {
            const statusSection = document.getElementById('status-text-add-modal');
            statusSection.scrollIntoView({alignToTop: false, behavior: 'smooth'});
        }
        if (controls.successText) {
            setTimeout(() => {
                closeModal();
            }, 2000);
        }
    }, [controls.failureText, controls.successText, controls.loading]);

    useEffect(() => setLoading(controls.loading), [controls.loading]);
    
    return (
        <>
            <p className='welcome-text'>
                Hey Stranger! Join our community.
            </p>

            <form className='form' id='add-user-form' onSubmit={handleSubmit}>
                <div className='form input-container'>
                    {controls.loading 
                        ?   <div className='loader-container-holder loader-container-add-holder'>
                                <Loader />
                            </div>
                        :   ''
                    }
                    <input
                        required
                        placeholder='First Name' 
                        name='firstName' 
                        value={userInfo.firstName} 
                        onChange={handleChange}
                    />
                    <input
                        required
                        placeholder='Last Name' 
                        name='lastName' 
                        value={userInfo.lastName} 
                        onChange={handleChange}
                    />
                    <input
                        required
                        placeholder='Email Address'
                        name='email'
                        type='email' 
                        value={userInfo.email}
                        onChange={handleChange}
                    />

                    <>
                        <div className='input-flex-container'>
                            <input
                                className='profile-picture-input'
                                required
                                type='url'
                                placeholder='Profile picture url' 
                                name='profilePictureUrl' 
                                value={userInfo.profilePictureUrl} 
                                onChange={handleChange}
                                disabled={userInfo.profilePictureFile?.name}
                            />
                            {userInfo.profilePictureFile?.name
                                ?   <span className='file-name'>
                                        {userInfo.profilePictureFile?.name}
                                        <span onClick={removeFile}>x</span>
                                    </span>
                                : null
                            }
                            {!userInfo.profilePictureUrl ?
                                <>
                                    <input
                                        id='add-file-btn'
                                        type='file'
                                        hidden
                                        accept='.png, .jpg, .jpeg, .jfif, .pjpeg, .pjp'
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
                        <span className='warning-text'>{controls.pfpWarningText}</span>
                        <br/>
                    </>

                    <div className='input-flex-container'>
                        <input
                            required
                            placeholder='Occupation' 
                            name='occupation' 
                            value={userInfo.occupation} 
                            onChange={handleChange}
                        />
                        <input
                            required
                            placeholder='Key skill' 
                            name='keySkill' 
                            value={userInfo.keySkill} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className='input-flex-container'>
                        <input 
                            required
                            placeholder='State' 
                            name='state' 
                            value={userInfo.state} 
                            onChange={handleChange}
                        />
                        <input
                            required
                            placeholder='Country' 
                            name='country' 
                            value={userInfo.country} 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button>Join</button>
            </form>

            <p id='status-text-add-modal'>
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
        </>
    );
};

export default AddProfileForm;