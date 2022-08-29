import { passwordStrength } from 'check-password-strength';

export const isMatch = (pass, confirm) => {
    if (!confirm || pass === confirm)
        return '';
    else return '*Must be the same as password';
};

export const passwordStrengthVal = pass => {
    if (pass) {
        const value = passwordStrength(pass).value;
        return value.split(' ')[value.split(' ').length - 1].toLowerCase();
    }
    return null;
};

export const passwordDiversity = pass => {
    if (pass) {
        const allDiversity = ['lowercase', 'uppercase', 'symbol', 'number'];
        const passDiversity = passwordStrength(pass).contains;
        const diversity = allDiversity.filter(divty => !passDiversity.includes(divty));
        return diversity[0];
    }
    return null;
};