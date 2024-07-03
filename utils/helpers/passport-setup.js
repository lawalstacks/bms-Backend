const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../../model/userModel');

/*passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:"http://localhost:8000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done)=>{
  const userExists = await User.findOne({googleId: profile.id});

  if(userExists){
    return(done, userExists);
  }
  const newUser = new User({
    googleId: profile.id,
    email: profile.email,
    username: profile.displayName.split(' ')[0],
    name: profile.displayName,
    profilePic: profile.photos[0].value
  })
  await newUser.save();
  done(null, newUser);
} ))

passport.serializeUser((user,done)=>{
  done(null, user.id);
})

passport.deserializeUser(async (id,done)=>{
  const user = await User.findById(id);
  done(null,user);
})*/
