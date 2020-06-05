const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const user = require('../schemas/user.schema');


passport.serializeUser((user, cb) => {
    console.log('=======', user);
    cb(null, user._id || user.id);
});

passport.deserializeUser((id, cb) => {
    user.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    user.findOne({id: jwt_payload.id}, function(err, result) {
        if (err) {
            return done(err, false);
        }
        if (result) {
            done(null, result);
        } else {
            done(null, false);
        }
    });
}));

passport.use(new LocalStrategy( async (username, password, cb) => {
    try{
        const result = await user.findOne({ username: username });
        result.comparePassword(password, result.password, (err, isMatch) => {
            if (isMatch && !err) {
                return cb(null, result);
            } else {
                return cb(null, false);
            }
        });
    } catch (e) {
        return cb(e);
    }
}));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/users/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
        user.findOneOrCreate(user, { facebookId: profile.id, name: profile.displayName, email: profile.email }, function (err, user) {
            return cb(err, user);
        });
        cb(null, profile);
    }
));

module.exports = passport;
