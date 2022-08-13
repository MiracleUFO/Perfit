import Header from '../components/Header';
import Hero from '../components/Hero';
import Users from '../components/Users';
import Footer from '../components/Footer';
import Modal from '../components/Modal/Modal';

const Home = () => {
    return (
        <main>
            <Modal />
            <Header />
            <Hero />
            <Users />
            <Footer />
        </main>
    );
};

export default Home;