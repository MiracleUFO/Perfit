import { useState, useEffect } from 'react';
import { useModalContext } from '../../context/modalContext';
import { addFormImg, editFormImg, signUpFormImg } from '../../constants/modalAssets';

import Logo from '../Logo';
import AddUserForm from './Forms/AddUserForm';
import EditProfileForm from './Forms/EditUserForm';
import SignUpForm from './Forms/SignUpForm';

import '../../styles/Modal.css';
import 'animate.css';

const Modal = () => {
    const 
        { loading, type, visible, setType, setVisible } = useModalContext(),
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
            }
        }
    }, [type]);

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

                    <div className='modal-form'>
                        <section className='brand-wrapper'>
                            <Logo onClick={closeModal} />
                        </section>
                        {type === 'add-user' ? <AddUserForm /> : null}
                        {type === 'edit-user' ? <EditProfileForm /> : null}
                        {type === 'sign-up' ? <SignUpForm /> : null}
                    </div>

                    <img className='section-img' {...imgAttrs} />
                    <p className='close-icon' onClick={closeModal}>
                        X
                    </p>

                </div>
            </section>
        );  else return null;
};

export default Modal;