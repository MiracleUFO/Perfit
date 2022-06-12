import { FaDiscord, FaMediumM } from 'react-icons/fa';
import { BsTwitter, BsSlack } from 'react-icons/bs';
import { ImHackernews } from 'react-icons/im';

import '../styles/Hero.css';

const Hero = () => {
    const scrollDown = () => {
        const top = document.getElementById('users-container').getBoundingClientRect().top + window.scrollY - 200;
        window.scroll({
        top: top,
        left: 100,
        behavior: 'smooth'
        });
    };

    return (
        <div className='hero-container'>
            <div className='hero-main'>
                <h1>
                    Your next role&apos;s best fit,<br />
                    here on perfit.
                </h1>
                <p>
                    A great place to find the best fits for your company. <br />
                    Delivered at the click of a button.
                </p>
                <button onClick={scrollDown}>
                    See freelancers →
                </button>
            </div>

            <div className='hero-other'>
                <h2>Premium talent pool</h2>
                <p>Get experienced builders, some employed by the best companies.</p>

                <div className='icons-container'>
                    <FaDiscord />
                    <BsTwitter />
                    <BsSlack />
                    <FaMediumM />
                    <ImHackernews />
                </div>
            </div>
        </div>
    );
};

export default Hero;