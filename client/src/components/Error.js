import PropTypes from 'prop-types';
import '../styles/Error.css';

const Error = ({ msg, children }) => <div className='error'>{msg}{children}</div>;

Error.propTypes = {
    msg: PropTypes.string,
    children: PropTypes.element
};

export default Error;