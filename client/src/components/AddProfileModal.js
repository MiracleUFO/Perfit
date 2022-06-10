import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { close } from '../helpers/modalLogic';
import Logo from './Logo';

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

    const closeModal = (e) => {
        close();
      }
    
      return (
        <section id='modal-wrapper-signup' onClick={closeModal}>
          <div id='modal-hidden-signup' className='modal-hidden' onClick={e => e.stopPropagation()}>
            <div className='modal-form'>
              <section className="brand-wrapper">
                <Logo />
              </section>
    
              <p>Hello Stranger, become a perfit member.</p>
    
              <form onSubmit={handleSubmit}>
                <input placeholder='Full Name' required name='fullname' value={state.fullname} onChange={handleChange} />
                <input placeholder='Email Address' required name='email' type="email" value={state.email} pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b" onChange={handleChange} />
                <input placeholder='Password' required name='password' type="password" value={state.password} onChange={handleChange} />
                <button>Sign up</button>
              </form>
    
              <p>{state.res}</p>
    
              <p>Already have account? <Link to={{pathname: '/', state: {background: location}}}>To Home</Link></p>
            </div>
    
            <img src={SignupImg} alt='Black boy wearing black heaphones' />
            <p className='closeIcon' onClick={closeModal}>X</p>
          </div>
        </section>
      );
}

export default AddProfileModal;