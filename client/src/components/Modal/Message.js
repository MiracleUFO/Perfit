import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import cat from '../../assets/cat-n-plant.png';
//import cactus from '../../assets/cactus';
import '../../styles/Message.css';

const Message = ({type /*will determine image to show, success is sleeping cat, info is cactus*/, msg}) => {
    console.log(msg);
    return (
        <div className='message-modal'>
            {type === 'verify-message' ?
                <div  className='animate__animated animate__backInLeft message'>
                    <div>
                        <span>Check your email to verify your account.</span>
                        <br />
                        <span>
                            Didn&apos;t get an email?<br />
                            <Link to="#">Click here to resend it.</Link>
                        </span>
                    </div>
                    <div><img src={cat} alt='Grey sleeping cat and plant' /></div>
                </div>
                : null
            }
        </div>
    );
};

Message.propTypes = {
    type: PropTypes.string,
    msg: PropTypes.string
};

export default Message;