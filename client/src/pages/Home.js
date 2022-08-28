import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Users from '../components/Users';
import Footer from '../components/Footer';
import Modal from '../components/Modal/Modal';
import ArrowToTop from '../components/ArrowToTop';

const Home = () => {
    const { token } = useParams();
    return (
        <main>
            <Modal />
            <ArrowToTop />
            <Header sToken={token} />
            <Hero />
            <Users />
            <Footer />
        </main>
    );
};

export default Home;