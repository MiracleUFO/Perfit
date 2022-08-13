import { useState, useEffect } from 'react';
import { useModalContext } from '../../context/modalContext';
import { addFormImg, editFormImg } from '../../constants/modalAssets';

import Logo from '../Logo';
import AddUserForm from './AddUserForm';
import EditProfileForm from './EditUserForm';

import '../../styles/Modal.css';

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