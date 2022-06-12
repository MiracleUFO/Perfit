export const displayEditProfileModal = () => {
    document.getElementById('modal-wrapper-edit-profile').setAttribute('class', 'modal-wrapper');
    document.getElementById('modal-hidden-edit-profile').setAttribute('class', 'modal');
};
  
export const displayAddProfileModal = () => {
    document.getElementById('modal-wrapper-add-profile').setAttribute('class', 'modal-wrapper');
    document.getElementById('modal-hidden-add-profile').setAttribute('class', 'modal');
};

export let close = () => {
    document.getElementsByClassName('modal-wrapper')[0].setAttribute('class', '');
    document.getElementsByClassName('modal')[0].setAttribute('class', 'modal-hidden');
};