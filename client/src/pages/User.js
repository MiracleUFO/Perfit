import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useUserContext } from '../context/userContext';
import { useModalContext } from '../context/modalContext';

import baseUrl from '../helpers/baseUrl';

import Modal from '../components/Modal/Modal';
import Loader from '../components/Loader';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Error from '../components/Error';

import { TbEditCircle } from 'react-icons/tb';
import CountryIcon from '../assets/country-icon.png';

import 'animate.css';
import '../styles/User.css';

const User = () => {
    const 
        location = useLocation(),
        [id] = useState(location.state?.id),
        [loading, setLoading] = useState(false),
        { setVisible, setType } = useModalContext(),
        { setId, setName } = useUserContext()
    ;

    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        occupation: '',
        state: '',
        country: '',
        keySkill: '',
        profilePicture: '',
    });

    const displayEditUserForm = () => {
        setVisible(true);
        setType('edit-user');
    };

    useEffect(() => {
        const url = baseUrl();
        setLoading(true);
        if (id) {
            axios.get(`${url}/api/users/${id}`)
                .then(res => {
                    setUserInfo(res.data);
                    setId(id);
                    setName(res.data.firstName);
                    setLoading(false);
                })
            ;
        }   else setLoading(false);
    },  [id]);

    if (loading) 
        return (
            <div className='loader-container-larger'>
                <Loader />
            </div>
        ); else if (!id && id !== 0) 
            return (
                <Error msg='User not specified'>
                    <NavLink to='/'>Go to Home</NavLink>
                </Error>
            ); else 
                return (
                    <main>
                        <Modal />
                        <div>
                            <Header />
                            <div className='user-info'>
                                <header></header>
                                <div className='content'>
                                    <section className='content-intro'>
                                        <div className='avatar-container'>
                                            <div className='avatar-container-small'>
                                                <img 
                                                    className='avatar animate__animated animate__fadeInRight animate__fast'
                                                    src={userInfo.profilePicture}
                                                    alt='User&apos;s avatar'
                                                />
                                                <TbEditCircle 
                                                    className='edit-icon' 
                                                    onClick={displayEditUserForm}
                                                />
                                            </div>
                                        </div>

                                        <div className='user-name-container'>
                                            <div className='animate__animated animate__fadeInRight'>
                                                <h1>{userInfo.firstName} {userInfo.lastName}</h1>
                                                <p>I&apos;m a(n) {userInfo.occupation} based in {userInfo.state}.</p>
                                            </div>
                                            <div 
                                                className='edit-box animate__animated animate__fadeInUp'
                                                onClick={displayEditUserForm}
                                            >
                                                Edit
                                            </div>
                                        </div>
                                    </section>

                                    <section className='about'>
                                        <div className='animate__animated animate__fadeInUp'>
                                            <h2>About Me</h2>
                                            <p>
                                                My name is {userInfo.firstName} {userInfo.lastName}.
                                                I&apos;m a(n) {userInfo.occupation} based in {userInfo.state}, {userInfo.country}.
                                            </p>
                                            <p>
                                                I specialise in {userInfo.keySkill}.
                                                <span className='more'>..</span>
                                            </p>
                                            <span>Hire me</span>
                                        </div>

                                        <div className='location animate__animated animate__fadeInRight'>
                                            <h3>Location</h3>
                                            <p>
                                                <img src={CountryIcon} alt='globe icon' />
                                                {userInfo.state}, {userInfo.country}
                                            </p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </main>
                );
};

export default User;