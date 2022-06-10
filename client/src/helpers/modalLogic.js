export const displayEditProfileModal = () => {
    document.getElementById('modal-wrapper-signin').setAttribute('class', 'modal-wrapper');
    document.getElementById('modal-hidden-signin').setAttribute('class', 'modal');
}
  
export const displayAddProfileModal = () => {
    document.getElementById('modal-wrapper-signup').setAttribute('class', 'modal-wrapper');
    document.getElementById('modal-hidden-signup').setAttribute('class', 'modal');
}

export let close = () => {
    document.getElementsByClassName('modal-wrapper')[0].setAttribute('class', '');
    document.getElementsByClassName('modal')[0].setAttribute('class', 'modal-hidden');
}