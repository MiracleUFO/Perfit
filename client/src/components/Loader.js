import LoaderGif from '../assets/loader.gif';
import '../styles/Loader.css';

const Loader = () => (
    <div className='loader-container'>
        <img src={LoaderGif} alt='Loader icon' />
    </div>
);

export default Loader;