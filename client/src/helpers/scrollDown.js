const scrollDown = (top) => {
    if (document.readyState === 'complete') {
        window.scroll({
            top: top,
            left: 100,
            behavior: 'smooth'
        }); 
    }
};

export default scrollDown;