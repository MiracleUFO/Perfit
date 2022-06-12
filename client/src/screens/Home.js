import Header from '../components/Header';
import Hero from '../components/Hero';
import Users from '../components/Users';
import Footer from '../components/Footer';
import AddProfileModal from '../components/AddUserModal';

const Home = () => {
    return (
        <main>
            <AddProfileModal />
            <Header />
            <Hero />
            <Users />
            <Footer />
        </main>
    );
};

export default Home;