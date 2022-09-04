const disableFutureDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    let date, month;
    date = today.getDate();
    month = today.getMonth() + 1;

    if (month < 9) {
        month = `0${month}`;
    }
    if (date < 9) {
        date = `0${date}`;
    }
    
    const formattedDate = `${year}-${month}-${date}`;
    return formattedDate;
};

export default disableFutureDates;