import { useState, useEffect } from 'react';
import isInViewport from '../helpers/isInViewPort';
import { scrollToTop } from '../helpers/animations';

import '../styles/ArrowToTop.css';

const ArrowToTop = () => {
    const [visible, setVisible] = useState();
    

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