import axios from 'axios';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useModalContext } from '../../context/modalContext';

import baseUrl from '../../helpers/baseUrl';
import cat from '../../assets/cat-n-plant.png';
import cactus from '../../assets/cactus.png';

import '../../styles/Message.css';

const Message = ({ type, msg }) => {
    const
        { setVisible } = useModalContext(),
        [countdown, setCountDown] = useState({
            seconds: 0,
            minutes: 0,
        })
    ;
    const restartTimer = () => {
        if (countdown.minutes === 0 && countdown.seconds == 0)
            setCountDown({seconds: 59, minutes: 5})
        ;
        const 
            url = baseUrl(),
            id = localStorage.getItem('perfit_user_id')
        ;
        return { url, id };
    };
    const resendVerificationCode = () => {
        const { id, url } = restartTimer();
        axios.get(`${url}/api/auth/resend-verify-token/${id}`);
    };
    const resendResetPasswordCode = () => {
        const { id, url } = restartTimer();
        axios.get(`${url}/api/auth/forgot-password/${id}`);
    };

    // Countdown handler / timer
    useEffect(() => {
        const seconds = Number(countdown.seconds), minutes = Number(countdown.minutes);
        const interval = setInterval(() => {
            const time = {
                seconds: seconds ? (seconds - 1).toString().padStart(2, '0') : 59,
                minutes: !seconds && minutes ? minutes - 1 : minutes
            };

            if (!(countdown.seconds == 0 && minutes === 0))
                setCountDown(time);
        },  1000);
        
        return () => clearInterval(interval);
    }, [countdown]);

    return (
        <div className='message-modal'>
            <div className='message'>
                <div className='animate__animated animate__backInLeft'>
                    {type === 'verify-message' ?
                        <>
                            <span className='header'>Check your email to verify your account.</span>
                            <br />
                            <span>
                                Didn&apos;t get an email?<br />
                                <button
                                    className='timer-btn'
                                    onClick={resendVerificationCode}
                                    disabled={!(countdown.minutes === 0 && countdown.seconds == 0)}
                                >
                                    Click here to resend
                                    {!(countdown.minutes === 0 && countdown.seconds == 0) ?
                                        <span>&nbsp;in 0{countdown.minutes}:{countdown.seconds}</span>
                                    :   '.'
                                    }
                                </button>
                            </span>
                        </>
                    :   null}
                    {type === 'forgot-password-message' ?
                        <>
                            <span className='header'>Check your email to reset your password</span>
                            <br />
                            <span>
                                Didn&apos;t get an email?<br />
                                <button
                                    className='timer-btn'
                                    onClick={resendResetPasswordCode}
                                    disabled={!(countdown.minutes === 0 && countdown.seconds === 0)}
                                >
                                    Click here to resend
                                    {!(countdown.minutes === 0 && countdown.seconds === 0) ?
                                        <span>&nbsp;in 0{countdown.minutes}:{countdown.seconds}</span>
                                    :   '.'
                                    }
                                </button>
                            </span>
                        </>
                    :   null}
                    {type !== 'verify-message' && type !== 'forgot-password-message' ?
                        {msg}
                    : null
                    }
                </div>
                <div>
                    <img 
                        className='animate__animated animate__pulse animate__slower animate__infinite'
                        src={type === 'verify-message' ? cat : cactus}
                        alt='Grey sleeping cat and plant'
                    />
                    <p className='close-icon' onClick={() => setVisible(false)}>
                        X
                    </p>
                </div>
            </div>
        </div>
    );
};

Message.propTypes = {
    type: PropTypes.string,
    msg: PropTypes.string
};

export default Message;