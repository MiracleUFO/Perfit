import Header from './Header';
import Hero from './Hero';
import Users from './Users';
import Footer from './Footer';
import AddProfileModal from './AddProfileModal';

const Home = () => {
    return (
        <main>
            <AddProfileModal />
            <Header />
            <Hero />
            <Users />
            <Footer />
        </main>
    )
}

export default Home;