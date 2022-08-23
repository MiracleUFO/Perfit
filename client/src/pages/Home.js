import Header from '../components/Header';
import Hero from '../components/Hero';
import Users from '../components/Users';
import Footer from '../components/Footer';
import Modal from '../components/Modal/Modal';
import ArrowToTop from '../components/ArrowToTop';

const Home = () => {
    return (
        <main>
            <Modal />
            <ArrowToTop />
            <Header />
            <Hero />
            <Users />
            <Footer />
        </main>
    );
};

export default Home;