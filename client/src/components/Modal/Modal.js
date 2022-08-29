import { useState, useEffect } from 'react';
import { useUserContext } from '../../context/userContext';
import { useModalContext } from '../../context/modalContext';
import { addFormImg, editFormImg, signUpFormImg } from '../../constants/modalAssets';

import Logo from '../Logo';
import Message from './Message';
import AddUserForm from './Forms/AddUserForm';
import EditProfileForm from './Forms/EditUserForm';
import SignUpForm from './Forms/SignUpForm';
import SignInForm from './Forms/SignInForm';
import ResetPasswordForm from './Forms/ResetPassword';

import '../../styles/Modal.css';
import 'animate.css';

const Modal = () => {
    const 
        { loading, type, visible, setType, setVisible } = useModalContext(),
        { currentUser } = useUserContext(),
        [imgAttrs, setImgAttrs] = useState({
            src: '',
            alt: ''
        })
    ;

    useEffect(() => {
        if (type) {
            switch (type) {
                case 'add-user':
                    setImgAttrs({...addFormImg});
                    break;
                case 'edit-user':
                    setImgAttrs({...editFormImg});
                    break;
                case 'sign-up':
                    setImgAttrs({...signUpFormImg});
                    break;
                case 'sign-in':
                    setImgAttrs({...signUpFormImg});
                    break;
                case 'reset':
                    setImgAttrs({...signUpFormImg});
                    break;
            }
        }
    }, [type]);

    useEffect(() => {
        if (currentUser.email && !currentUser.verified) {
            setType('verify-message');
            setVisible(true);
        }
    }, [currentUser]);

    const closeModal = () => {
        if (!loading) {
            setVisible(false);
            setType('');
        }
    };

    if (visible && type) 
        return (
            <section className='modal-wrapper' onClick={closeModal}>
                <div className='modal' onClick={e => e.stopPropagation()}>
                    {type.indexOf('message') !== -1 ? 
                        <Message type={type} close={closeModal} /> :
                        <>
                            <div className='modal-form'>
                                <section className='brand-wrapper'>
                                    <Logo onClick={closeModal} />
                                </section>
                                {type === 'add-user' ? <AddUserForm /> : null}
                                {type === 'edit-user' ? <EditProfileForm /> : null}
                                {type === 'sign-up' ? <SignUpForm /> : null}
                                {type === 'sign-in' ? <SignInForm /> : null}
                                {type === 'reset' ? <ResetPasswordForm /> : null}
                            </div>

                            <img className='section-img' {...imgAttrs} />
                            <p className='close-icon' onClick={closeModal}>
                                X
                            </p>
                        </>
                    }
                </div>
            </section>
        );  else return null;
};

export default Modal;