import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useModalContext } from '../../../context/modalContext';
import { useUserContext } from '../../../context/userContext';

import Loader from '../../Loader';

import baseUrl from '../../../helpers/baseUrl';
import createImageUrl from '../../../helpers/createImageUrl';
import initialCaps from '../../../helpers/initialsCaps';
import isValidImageSet from '../../../helpers/isValidImageSet';

const AddProfileForm = () => {
    const initUserInfo = {
        email: '',
        firstName: '',
        lastName: '',
        occupation: '',
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
        { setJustAdded, currentUser, setCurrentUser } = useUserContext(),
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
        const text = isValidImageSet(profilePictureUrl, profilePictureFile) ? '' : '*Please upload a still image (jpegs or png url or file.)';
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
            firstName,
            lastName,
            occupation,
            state,
            country,
            keySkill,
            profilePictureUrl,
            profilePictureFile,
        } = userInfo;

        if (currentUser.email)
            try {
                const profilePicture = await createImageUrl(profilePictureUrl ||  profilePictureFile);

                if (profilePicture) {
                    const user = {
                        id: currentUser.id,
                        email: currentUser.email,
                        firstName,
                        lastName,
                        occupation,
                        state,
                        country,
                        keySkill,
                        profilePicture,
                    };
                    //  Sending 'add profile' req to server.
                    axios.post(`${url}/api/users`, user, {headers: {'x-auth-token': localStorage.getItem('perfit_user_session')}})
                        .then(res => {
                            setJustAdded(true);
                            setUserInfo({...initUserInfo});
                            setControls({...initControls, successText: res.data.message});
                            setCurrentUser({...currentUser});
                        })
                        .catch(err => {
                            setUserInfo({...initUserInfo});
                            setControls({...initControls, failureText: err.response.data.error || 'Failed to add profile. Try again.'});
                        });
                }
            } catch(e) {
                setUserInfo({...userInfo, profilePictureUrl: '', profilePictureFile: {}});
                setControls({loading: false, failureText: 'Profile picture not uploaded successfully. Try again.'});
            }
        else setControls({loading: false, failureText: 'Not authorised, please sign in.'});
    };

    //  Scrolls to control text at bottom of modal
    useEffect(() => {
        if (controls.successText || controls.failureText) {
            const statusSection = document.getElementById('status-text-add-modal');
            statusSection?.scrollIntoView({alignToTop: false, behavior: 'smooth'});
        }
        if (controls.successText) {
            setTimeout(() => {
                closeModal();
            }, 2000);
        }
    }, [controls.failureText, controls.successText, controls.loading]);

    useEffect(() => setLoading(controls.loading), [controls.loading]);
    
    return (
        <div className='animate__animated animate__backInLeft'>
            <p className='welcome-text'>
                Hey you! Add your profile.
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
                                        <span>{userInfo.profilePictureFile?.name}</span>
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
                        {controls.pfpWarningText ?
                            <span className='info-text warning-text'>{controls.pfpWarningText}</span>
                        :   <span className='info-text success-text'>**A picture of you with a solid, neutral background.</span>
                        }
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
                <button>Add Profile</button>
            </form>

            {controls.successText || controls.failureText ?
                <p id='status-text-add-modal' className='status-text'>
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

export default AddProfileForm;