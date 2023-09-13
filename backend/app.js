const router = require("./routes/authRoutes");

const passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy,
  config = require("./config"),
  express = require("express"),
  app = express(),
  user = require("./models/userModel"),
  lodash = require("lodash"),
  session = require("express-session");
app.set("view engine", "ejs");
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook_api_key,
      clientSecret: config.facebook_api_secret,
      callbackURL: config.callback_url,
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        if (config.use_database) {
          user.find({ _id: profile.id }).then((data) => {
            if (data && data.length == 0) {
              console.log("There is no such user, adding now");
              user.save(
                lodash.pick(
                  {
                    _id: profile.id,
                    user_name: profile.username,
                  },
                  ["_id", "Username"]
                )
              );
            } else {
              console.log("Username exists");
            }
          });
        }
        return done(null, profile);
      });
    }
  )
);
app.use("/", router);
const port = 3000;
app.listen(port, () => {
  console.log("run server");
});
