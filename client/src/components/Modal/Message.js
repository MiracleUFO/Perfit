import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import cat from '../../assets/cat-n-plant.png';
//import cactus from '../../assets/cactus.png';
import '../../styles/Message.css';

const Message = ({type, close, msg}) => {
    return (
        <div className='message-modal'>
            {type === 'verify-message' ?
                <div className='message'>
                    <div className='animate__animated animate__backInLeft'>
                        <span>Check your email to verify your account.</span>
                        <br />
                        <span>
                            Didn&apos;t get an email?<br />
                            <Link to="#">Click here to resend it.</Link>
                        </span>
                    </div>
                    <div>
                        <img 
                            className='animate__animated animate__pulse animate__slower animate__infinite'
                            src={cat}
                            alt='Grey sleeping cat and plant'
                        />
                        <p className='close-icon' onClick={close}>
                            X
                        </p>
                    </div>
                </div>
                : null
            }
            {msg ? msg : null}
        </div>
    );
};

Message.propTypes = {
    type: PropTypes.string,
    msg: PropTypes.string,
    close: PropTypes.func
};

export default Message;