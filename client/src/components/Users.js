import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

import baseUrl from '../helpers/baseUrl';
import { slideInUserCards, scrollDown, beep } from '../helpers/animations';

import 'animate.css';
import '../styles/Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const { justAdded, setJustAdded } = useUserContext();

    const fetchUsers = async () => {
        const url = baseUrl();
        axios.get(`${url}/api/users`)
            .then(res => setUsers(res.data))
        ;
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (justAdded)
            fetchUsers();
    },  [justAdded]);

    useEffect(() => {
        if (users.length) {
            slideInUserCards();
            
            if (justAdded) {
                setTimeout(() => {
                    const
                        usersContainer = document.getElementById('users-container'),
                        top = usersContainer.getBoundingClientRect().top + window.scrollY + usersContainer.clientHeight - 500,
                        usersCards = Array.from(document.getElementsByClassName('user-card')),
                        lastUserCard = usersCards.pop()
                    ;

                    scrollDown(top);
                    beep(lastUserCard, usersCards);

                    lastUserCard?.addEventListener('animationend', (e) => {
                        if (e.animationName === 'pulse') {
                            setJustAdded(false);
                        }
                    });
                }, 3000);
            } else {
                window.addEventListener('scroll', slideInUserCards);
            }
        }
        return () => {
            window.removeEventListener('scroll', slideInUserCards);
        };
    }, [users, justAdded]);

    return (
        <div id='users-container' className='container'>
            <h1>Freelancer Profiles 🤖</h1>
            <div>
                {users.map(user =>
                    <Link
                        className='user-card'
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