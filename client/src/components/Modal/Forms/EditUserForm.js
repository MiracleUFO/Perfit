import axios from 'axios';
import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import { useUserContext } from '../../../context/userContext';
import { useModalContext } from '../../../context/modalContext';

import isFalsish from '../../../helpers/isFalsish';
import baseUrl from '../../../helpers/baseUrl';
import createImageUrl from '../../../helpers/createImageUrl';
import initialCaps from '../../../helpers/initialsCaps';
import isValidImageSet from '../../../helpers/isValidImageSet';

import Loader from '../../Loader';

const EditProfileForm = () => {
	const initUserInfo = {
        firstName: '',
        lastName: '',
        occupation: '',
        state: '',
        country: '',
        keySkill: '',
        profilePictureUrl: '',
        profilePictureFile: {},
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
        { setVisible, setLoading } = useModalContext(),
        { id, name, currentUser } = useUserContext()
    ;

    const closeModal = () => {
        setVisible(false);
        setUserInfo({...initUserInfo});
        setControls({...initControls});
    };

    const handleChange = (e) => {
        let value = e.target.type === 'text' ? initialCaps(e.target.value) : e.target.value;
        setUserInfo({...userInfo, [e.target.name]: value});
    };

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
    const handleSubmit = async () => {
        const url = baseUrl();
        const valid = isFalsish(userInfo);

        if (valid) {
            setUserInfo({...userInfo});
            setControls({...controls, loading: true});
            const {
                firstName,
                lastName,
                occupation,
                country,
                keySkill,
                profilePictureUrl,
                profilePictureFile
            } = userInfo;

            try {
                const profilePicture = (profilePictureUrl || JSON.stringify(profilePictureFile) !== '{}')
                    ?   await createImageUrl(profilePictureUrl ||  profilePictureFile)
                    :   ''
                ;
                const user = {
                    email: currentUser.email,
                    firstName,
                    lastName,
                    occupation,
                    state: userInfo.state,
                    country,
                    keySkill,
                    profilePicture
                };

                axios.put(`${url}/api/users/${id}`, user, {headers: {'x-auth-token': localStorage.getItem('perfit_user_session')}})
                    .then(() => {
                        setUserInfo({...initUserInfo});
                        setControls({...initControls, successText: 'User info edited successfully.'});
                    })
                    .catch(err => {
                        setUserInfo({...initUserInfo});
                        setControls({
                            ...initControls,
                            failureText: err.response.data.error || 'Failed to sign up. Try again.'
                        });
                    })
                ;
            } catch (err) {
                setUserInfo({...userInfo, profilePictureUrl: '', profilePictureFile: {}});
                setControls({loading: false, failureText: 'Profile picture not uploaded successfully. Try again.'});
            }
        } else setControls({...controls, failureText: 'Must edit at least one field'});
    };

    //  Scrolls to control text at bottom of modal
    useEffect(() => {
        if (controls.successText || controls.failureText) {
            document.getElementById('status-text-edit-modal').scrollIntoView({alignToTop: false, behavior: 'smooth'});
        }
        
        if (controls.successText) {
            setTimeout(() => {
                closeModal();
                window.location.reload(false);
            }, 2000);
        }
    }, [controls.failureText, controls.successText, controls.loading]);

    useEffect(() => setLoading(controls.loading), [controls.loading]);
    
    return (
        <div className='animate__animated animate__backInLeft form-holder'>
            <p className='welcome-text'>
                Hey {name}! Edit your profile.
            </p>

            <div className='form'>
                {controls.loading 
                    ?   <div className='loader-container-holder loader-container-edit-holder'>
                            <Loader />
                        </div>
                    :   null
                }
                <div className='form input-container'>
                    <input
                        placeholder='First Name' 
                        name='firstName' 
                        value={userInfo.firstName} 
                        onChange={handleChange}
                    />
                    <input
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
                                        {userInfo.profilePictureFile?.name}
                                        <span onClick={removeFile}>x</span>
                                    </span>
                                : null
                            }
                            {!userInfo.profilePictureUrl ?
                                <>
                                    <input
                                        id='edit-file-btn'
                                        type='file'
                                        hidden
                                        accept='.png, .jpg, .jpeg, .jfif, .pjpeg, .pjp'
                                        onChange={handleFileUploadChange}
                                    />
                                    <label
                                        className='file-label'
                                        htmlFor='edit-file-btn'
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
                        <br />
                    </>

                    <div className='input-flex-container'>
                        <input
                            placeholder='Occupation' 
                            name='occupation' 
                            value={userInfo.occupation} 
                            onChange={handleChange}
                        />
                        <input
                            placeholder='Key skill' 
                            name='keySkill' 
                            value={userInfo.keySkill} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className='input-flex-container'>
                        <input 
                            placeholder='State' 
                            name='state' 
                            value={userInfo.state} 
                            onChange={handleChange}
                        />
                        <input
                            placeholder='Country' 
                            name='country' 
                            value={userInfo.country} 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button onClick={handleSubmit}>Save</button>
            </div>

            {controls.successText || controls.failureText ?
                <p id='status-text-edit-modal' className='status-text'>
                    <span className='success-text'>{controls.successText}</span>
                    <span className='failure-text'>{controls.failureText}</span>
                </p>
            :   null
            }
        </div>
    );
};

EditProfileForm.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string
};

export default EditProfileForm;