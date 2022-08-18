import { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext({
    id: null,
    name: '',
    justAdded: false,
});

export const UserProvider = ({ children }) => {
    const [id, setId] = useState(null);
    const [name, setName] = useState('');
    const [justAdded, setJustAdded] = useState(false);

    return (
        <UserContext.Provider 
            value={{ id, name, justAdded, setId, setName, setJustAdded }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);

UserProvider.propTypes = {
    children: PropTypes.element
};