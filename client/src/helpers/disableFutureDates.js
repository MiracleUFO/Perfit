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

{/*<input
                        required
                        type='date'
                        placeholder='DOB'
                        title='Pick your date of birth (this is for verification purposes.)'
                        name='dob'
                        value={state.dob} 
                        onChange={handleChange}
                        max={disableFutureDates()}
                    /> add to auth sign up (don't allow less than 13)*/}