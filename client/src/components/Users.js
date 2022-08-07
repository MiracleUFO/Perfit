import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import baseUrl from '../helpers/baseUrl';
import isInViewport from '../helpers/isInViewPort';

import 'animate.css';
import '../styles/Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const url = baseUrl();
        axios.get(`${url}/api/users`)
            .then(res => setUsers(res.data));
    }, []);

    useEffect(() => {
        if (users.length) {
            slideInAnimationUsersContainer();
            window.addEventListener('scroll', slideInAnimationUsersContainer);
        }

        return () => {
            window.removeEventListener('scroll', slideInAnimationUsersContainer);
        };
    }, [users]);

    // Slide in when user container is in view
    const slideInAnimationUsersContainer = () => {
        const 
            usersContainer = document.getElementById('users-container'),
            animatedClassesForHeader = ['animate__animated', 'animate__fadeInRightBig'],
            animatedClassesForUsers = ['animate__animated', 'animate__bounceInRight'],
            userCards = Array.from(usersContainer.getElementsByClassName('user-card')),
            h1 = usersContainer.getElementsByTagName('h1')[0]
        ;
        if (isInViewport(usersContainer)) {
            h1.classList.add(...animatedClassesForHeader);
            for (let i = 0; i < userCards.length; i++) {
                userCards[i].classList.add(...animatedClassesForUsers);
                userCards[i].style.opacity = 1;
            }
        } else {
            h1.classList.remove(...animatedClassesForHeader);
            for (let i = 0; i < userCards.length; i++) {
                userCards[i].classList.remove(...animatedClassesForUsers);
                userCards[i].style.opacity = 0.5;
            }
        }
    };

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