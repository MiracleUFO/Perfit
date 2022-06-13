export const isEmpty = (obj) => {
    const isEmpty = Object.values(obj).every(x => (x === false || x === ''));
    return !isEmpty;
};