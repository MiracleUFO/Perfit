import { useState, useEffect } from 'react';
import isInViewport from '../helpers/isInViewPort';
import '../styles/ArrowToTop.css';

const ArrowToTop = () => {
    const [visible, setVisible] = useState();
    const scrollToTop = () => {
        window.scroll({
            top: 0,
            left: 100,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const setVisibleLoc = () => {
            if (isInViewport(document.getElementsByClassName('hero-container')[0]))
                setVisible(false);
            else setVisible(true);
        };

        window.addEventListener('scroll', setVisibleLoc);

        return () => {
            window.removeEventListener('scroll', setVisibleLoc);
        };
    }, []);

    if (visible) 
        return (
            <button className='arrow-up-btn' onClick={scrollToTop}>↑</button>
        );
};

export default ArrowToTop;