import { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext({
    id: null,
    name: ''
});

export const UserProvider = ({ children }) => {
    const [id, setId] = useState(null);
    const [name, setName] = useState('');

    return (
        <UserContext.Provider 
            value={{ id, name, setId, setName }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);

UserProvider.propTypes = {
    children: PropTypes.element
};