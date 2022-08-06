const isInViewport = element => {
    var bounding = element.getBoundingClientRect();
    return (
        (bounding.top >= 0 && bounding.bottom <= window.innerHeight) || 
        (bounding.top < window.innerHeight && bounding.bottom >= 0)
    );
};

export default isInViewport;