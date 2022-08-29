import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

import baseUrl from '../helpers/baseUrl';
import { slideInUserCards, scrollDown, scrollToTop, beep } from '../helpers/animations';

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
        slideInUserCards();
        window.addEventListener('scroll', slideInUserCards);

        return () => {
            window.removeEventListener('scroll', slideInUserCards);
        };
    }, []);

    useEffect(() => {
        if (justAdded)
            fetchUsers();
    },  [justAdded]);

    const usersContainerRef = useCallback(node => {
        if (node && justAdded)
            setTimeout(() => {
                const
                    top = node?.getBoundingClientRect().top + window.scrollY + node?.clientHeight - 500,
                    usersCards = Array.from(document.getElementsByClassName('user-card')),
                    lastUserCard = usersCards?.pop()
                ;
                scrollDown(top);
                lastUserCard?.addEventListener('animationend', beepAnimationContainer);
            }, 3000);
    });

    const beepAnimationContainer = (e) => {
        if (e.animationName === 'bounceInRight')
            beep(e.target, document.getElementById('user-cards-container'));
        if (e.animationName === 'pulse') {
            e.target?.removeEventListener('animationend', beepAnimationContainer);
            setJustAdded(false);
            scrollToTop();
            window.location.reload();
        }
    };

    return (
        <div id='users-container' className='container' ref={usersContainerRef}>
            <h1>Freelancer Profiles 🤖</h1>
            <div id='user-cards-container'>
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