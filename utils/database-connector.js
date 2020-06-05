const mongoose = require('mongoose');
const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}`;

module.exports = {
    connectToServer: async () => {
        try {
            return Promise.resolve(mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true }));
        } catch (err) {
            return Promise.reject(err);
        }
    },
    getMongoose: () => {
        return mongoose;
    }
};
