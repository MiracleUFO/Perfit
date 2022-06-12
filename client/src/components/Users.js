import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import baseUrl from '../helpers/baseUrl';

import '../styles/Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const url = baseUrl();
        axios.get(`${url}/api/users`)
            .then(res => setUsers(res.data));
    },  []);

    return (
        <div className='container'>
            <h1>Freelancer Profiles 🤖</h1>
            <div id='users-container'>
                {users.map(user =>
                    <Link
                        className='user-container'
                        key={user.id} 
                        to={{
                            pathname: '/user',
                            state: {id: user.id}
                        }}
                    >
                        <div className='user'>
                            <img src={user.profilePicture} alt={user.firstName} />

                            <div className='user-textbox'>
                                <p className='main-text'>{user.firstName} {user.lastName}</p>
                                <p>{user.occupation}</p>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </div> 
    );
};

export default Users;