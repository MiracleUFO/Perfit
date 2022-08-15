const mongoose = require('mongoose');
const fetch = require('node-fetch');
const config = require('../config/mongo');
const db = require('./connection');

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
                    };

                    createUser(formattedUser);
                });
            });
    };
};

console.log(config.uri, config._config);

const seed = async () => {
    if (!db) {
        mongoose.connect(config.uri, config._config);

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
        console.log('Seeded / re-initialised database.');
    } catch (err) {
        console.error(err);
    }
}

seedDatabase();

module.exports = seedDatabase;