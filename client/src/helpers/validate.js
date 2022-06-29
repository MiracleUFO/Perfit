const isEmpty = (obj) => {
    const isEmpty = Object.values(obj).every(x => (x === false || x === '' || JSON.stringify(x) === '{}'));
    return !isEmpty;
};

export default isEmpty;