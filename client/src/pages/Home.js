import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Users from '../components/Users';
import Footer from '../components/Footer';
import Modal from '../components/Modal/Modal';
import ArrowToTop from '../components/ArrowToTop';

import { useModalContext } from '../context/modalContext';

const Home = () => {
    const 
        search = useLocation().search,
        sToken = new URLSearchParams(search).get('sToken'),
        { setVisible, setType } = useModalContext()
    ;

    useEffect(() => {
        if (window.location.href.includes('reset')) {
            setVisible(true);
            setType('reset');
        }
    }, []);

    return (
        <main>
            <Modal />
            <ArrowToTop />
            <Header sToken={sToken} />
            <Hero />
            <Users />
            <Footer />
        </main>
    );
};

export default Home;