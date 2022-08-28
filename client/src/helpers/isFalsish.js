const isFalsish = (obj) => {
    const isFalsish = Object.values(obj).every(x => (x === false || x === '' || JSON.stringify(x) === '{}'));
    return !isFalsish;
};

export default isFalsish;