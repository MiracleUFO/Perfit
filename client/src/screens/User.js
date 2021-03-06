import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import AddProfileModal from '../components/AddUserModal';
import EditProfileModal from '../components/EditUserModal';
import Loader from '../components/Loader';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { displayEditProfileModal } from '../helpers/modalLogic';
import baseUrl from '../helpers/baseUrl';

import { TbEditCircle } from 'react-icons/tb';

import CountryIcon from '../assets/images/country-icon.png';
import '../styles/User.css';

const User = () => {
    const location = useLocation();
    const [id] = useState(location.state.id);
    const [loading, setLoading] = useState(false);

    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        occupation: '',
        state: '',
        country: '',
        keySkill: '',
        profilePicture: '',
    });

    useEffect(() => {
        setLoading(true);
        const url = baseUrl();
        axios.get(`${url}/api/users/${id}`)
            .then(res => {
                setUserInfo(res.data);
                setLoading(false);
            });
    }, []);

    return (
        <main>
            <AddProfileModal />
            <EditProfileModal 
                id={id}
                name={userInfo.firstName}
            />
            {loading 
                ?   <div className='loader-container-larger'>
                        <Loader />
                    </div>
                :   
                    <div>
                        <Header />
                        <div className='user-info'>
                            <header></header>
                            <div className='content'>
                                <section className='content-intro'>
                                    <div className='avatar-container'>
                                        <div className='avatar-container-small'>
                                            <img 
                                                className='avatar'
                                                src={userInfo.profilePicture}
                                                alt='User&apos;s avatar'
                                            />
                                            <TbEditCircle 
                                                className='edit-icon' 
                                                onClick={displayEditProfileModal}
                                            />
                                        </div>
                                    </div>

                                    <div className='user-name-container'>
                                        <div>
                                            <h1>{userInfo.firstName} {userInfo.lastName}</h1>
                                            <p>I&apos;m a(n) {userInfo.occupation} based in {userInfo.state}.</p>
                                        </div>
                                        <div 
                                            className='edit-box'
                                            onClick={displayEditProfileModal}
                                        >
                                            Edit
                                        </div>
                                    </div>
                                </section>

                                <section className='about'>
                                    <div>
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

                                    <div className='location'>
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
            }
        </main>
    );
};

export default User;