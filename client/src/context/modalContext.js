import { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const ModalContext = createContext({
    loading: false,
    visible: false,
    type: ''
});

export const ModalProvider = ({ children }) => {
    const [type, setType] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <ModalContext.Provider 
            value={{ type, setType, visible, setVisible, loading, setLoading }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = () => useContext(ModalContext);

ModalProvider.propTypes = {
    children: PropTypes.element
};