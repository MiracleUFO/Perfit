const mongoose = require('mongoose');
const fetch = require('node-fetch');
const db = require('../db/connection');
const { createUser } = require('../controllers/usersController');


const populate = async () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.connection.collections['users'].drop();
        fetch('https://random-data-api.com/api/users/random_user?size=15')
            .then(res => res.json())
            .then(json => {
                json.map(user => {
                    const { email, id } = user;
                    const { state, country } = user.address;
                    const formattedUser = {
                        id,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        dob: user.date_of_birth,
                        email,
                        state,
                        country,
                        occupation: user.employment.title,
                        keySkill: user.employment.key_skill,
                        profilePicture: user.avatar
                    }

                    createUser(formattedUser);
                })
            })
    }
}

const seed = async () => {
    if (!db) {
        mongoose.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        db.on('error', console.error.bind(console, 'connection error:'));

        return db.once('open', async () => {
            return populate();
        });
    }
  
    return populate();
} 

const seedDatabase = async () => {
    try {
        await seed();
    } catch (err) {
        console.error(err);
    }
}

module.exports = seedDatabase;