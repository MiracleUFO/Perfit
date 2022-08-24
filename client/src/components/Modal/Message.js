import PropTypes from 'prop-types';

const Message = ({type /*will determine image to show, success is sleeping cat, info is cactus*/, msg}) => {
    return (
        <div className='animate__animated animate__backInLeft'>
            {msg}{type}
        </div>
    );
};

Message.propTypes = {
    type: PropTypes.string,
    msg: PropTypes.string
};

export default Message;