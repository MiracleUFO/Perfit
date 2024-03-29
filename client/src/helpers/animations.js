import isInViewport from './isInViewPort';

export const scrollDown = (top) => {
    if (document.readyState === 'complete')
        window.scroll({
            top: top,
            left: 100,
            behavior: 'smooth'
        });
};

export const scrollToTop = () => {
    window.scroll({
        top: 0,
        left: 100,
        behavior: 'smooth'
    });
};

export const beep = (el, container) => {
    if (document.readyState === 'complete') {
        const animationClasses = ['animate__animated', 'animate__pulse'];

        if (container) {
            for (let i = 0; i < container.length; i++) {
                container[i].classList.remove('animate__pulse');
            }
        }
        if (el) {
            el.classList.remove('animate__bounceInRight');
            el.classList.add(...animationClasses);
        }
    }
};

// Slide in user cards when user container is in view
export const slideInUserCards = () => {
    if (document.readyState === 'complete') {
        const 
            usersContainer = document.getElementById('users-container'),
            animatedClassesForHeader = ['animate__animated', 'animate__fadeInRightBig'],
            animatedClassesForUsers = ['animate__animated', 'animate__bounceInRight'],
            userCards = Array.from(usersContainer.getElementsByClassName('user-card')),
            h1 = usersContainer.getElementsByTagName('h1')[0]
        ;

        if (isInViewport(usersContainer) && document.readyState === 'complete') {
            h1.classList.add(...animatedClassesForHeader);
            for (let i = 0; i < userCards.length; i++) {
                if (!Array.from(userCards[i].classList).includes('animate__pulse')) { 
                    userCards[i].classList.add(...animatedClassesForUsers);
                    userCards[i].classList.remove('animate__pulse');
                }
            }
        } else {
            h1.classList.remove(...animatedClassesForHeader);
            for (let i = 0; i < userCards.length; i++) {
                userCards[i].classList.remove(...animatedClassesForUsers, 'animate__pulse');
            }
        }
    }
};