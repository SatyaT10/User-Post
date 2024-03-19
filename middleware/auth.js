const config = require('../config/config');
var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/userModel');

module.exports = function (passport) {
    passport.use(
        new jwtStrategy({
            secretOrKey: config.secret_jwt,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
            function (jwt_payload, done) {
                console.log(jwt_payload);
                User.findOne({ email: jwt_payload.userData.email })
                    .then(user => {
                        if (user) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    }).catch(err => {
                        if (err) {
                            return done(err, false);
                        }
                    })

            }
        )
    )
}





