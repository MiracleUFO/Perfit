import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

import { close } from '../helpers/modalLogic';
import { EMAIL_PATTERN } from '../constants';

import '../styles/css/Modal.css';

const AddProfileModal = () => {
    const [state, setState] = useState({
        res: '',
        email: '',
        firstName: '',
        lastName: '',
        occupation: '',
        dob: '',
        state: '',
        country: '',
        keySkill: '',
        profilePicture: ''
    });

    const location = useLocation();

    const handleChange = (e) => {
        setState({...state, [e.target.name]: e.target.value});
    }

    const handleSubmit = () => {

    }

    const closeModal = (e) => {
        close();
    }
    
      return (
        <section id='modal-wrapper-add-profile' onClick={closeModal}>
            <div id='modal-hidden-add-profile' className='modal-hidden' onClick={e => e.stopPropagation()}>
                <div className='modal-form'>
                    <section className="brand-wrapper">
                        <Logo onClick={closeModal} />
                    </section>
        
                    <p className='welcome-text'>
                        Hey Stranger! Join our community.
                    </p>
        
                    <form onSubmit={handleSubmit}>
                        <input 
                            placeholder='First Name' 
                            required name='firstName' 
                            value={state.firstName} 
                            onChange={handleChange}
                        />
                        <input 
                            placeholder='Last Name' 
                            required name='lastName' 
                            value={state.lastName} 
                            onChange={handleChange}
                        />
                        <input 
                            placeholder='Email Address'
                            required name='email'
                            type='email' value={state.email}
                            pattern={EMAIL_PATTERN}
                            onChange={handleChange}
                        />
                        <div className='input-flex-container'>
                            <input 
                                placeholder='Occupation' 
                                required name='occupation' 
                                value={state.occupation} 
                                onChange={handleChange}
                            />
                            <input 
                                placeholder='Key skill' 
                                required name='keySkill' 
                                value={state.keySkill} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className='input-flex-container'>
                            <input 
                                placeholder='State' 
                                required name='state' 
                                value={state.state} 
                                onChange={handleChange}
                            />
                            <input 
                                placeholder='Country' 
                                required name='country' 
                                value={state.country} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className='input-flex-container'>
                            <input 
                                placeholder='Date of birth' 
                                required name='dob' 
                                value={state.dob} 
                                onChange={handleChange}
                            />
                            <input 
                                placeholder='Profile picture url' 
                                required name='profilePicture' 
                                value={state.profilePicture} 
                                onChange={handleChange}
                            />
                        </div>
                        <button>Join</button>
                    </form>
        
                    <p>{state.res}</p>
        
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
                    alt='Black woman holding sparkling lights.'
                />

                <p className='close-icon' onClick={closeModal}>
                    X
                </p>
            </div>
        </section>
      );
}

export default AddProfileModal;