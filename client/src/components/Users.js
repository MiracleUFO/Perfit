import axios from 'axios';
import { useEffect, useState } from 'react';

import baseUrl from '../helpers/baseUrl';

import '../assets/css/Users.css';

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
                    <div className='user-container' key={user.id}>
                        <img src={user.profilePicture} alt={user.firstName} />

                        <div className='user-textbox'>
                            <p className='main-text'>{user.firstName} {user.lastName}</p>
                            <p>{user.occupation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div> 
    )
}

export default Users;