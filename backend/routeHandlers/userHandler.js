const User = require("../models/user");
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;


//---------------------------------------SignUp-------------------------------------------------------

const addUser = (req, res, next) => {

  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const details = new User({
    personalInformation: {
      name: req.body.name,
      DOB: req.body.dateOfBirth
    },
    contactDetails: {
      email: req.body.email,
    },
    loginDetails: {
      hash: hash,
      salt: salt,
    },
    userProfileURL: "http://www.google.com",
    interests: ["Photography", "Reading Books", "Music", "Dance", "Coding", "Computer Science", "Books", "Novels",
    "Sports", "Cricket", "Football", "Travel", "Science", "Mathematics", "Motivation", "Gym", "Technology", "Politics"],
  });

  details.save()
    .then((savedDoc) => {
      res.json({
        isSignUpSuccessfull: true,
        password: req.body.password,
        email: req.body.email
      });
    })
    .catch(err => { res.json({ isSignUpSuccessfull: false, error: err }); });
};



//------------------------------------------ editProfile ------------------------------------------------

const editUser = async (req, res) => {
  const filter = req.user._id;
  await User.findByIdAndUpdate(filter , {
    personalInformation : {
      ...req.user.personalInformation,
      birthPlace: req.body.birthPlace ? req.body.birthPlace : req.user.personalInformation.birthPlace,
      currentCity: req.body.currentCity ? req.body.currentCity : req.user.personalInformation.currentCity,
      profession : req.body.profession ? req.body.profession: req.user.personalInformation.profession
    },
    contactDetails : {
      ...req.user.contactDetails,
      phone : req.body.phone ? req.body.phone : req.user.contactDetails.phone    //unique
    },
    Bio : req.body.bio ? req.body.bio : req.user.Bio,
    //profileImageURL : "https://i.stack.imgur.com/l60Hf.png",
    // coverImageURL : req.body.coverImageURL,
    // userProfileURL: req.body.userProfileURL,
    followers : [],
    following : [],
    community : req.body.community,
    interests: req.body.interests,
    
  }, (err , details) => {
    if(err){
      res.json({isUpdated: false})
    }else{
      res.json({isUpdated: true});

    }
  });
}

const sendUser = (req, res) => {
  if (req.isAuthenticated()) {

    const checkComplete = {
      personalInformation: false,
      contactDetails: false,
      interests: false,
      Bio: false,
      profileImageURL: false,
      coverImageURL: false,
    }

    if (!(
      req.user.personalInformation.currentCity === undefined ||
      req.user.personalInformation.profession === undefined)
    ) {
      checkComplete.personalInformation = true;
    }

    if (req.user.contactDetails.phone !== undefined) {
      checkComplete.contactDetails = true;
    }
    if (req.user.Bio !== undefined || req.user.Bio === "") {
      checkComplete.Bio = true;
    }
    if (req.user.userProfileURL !== undefined) {
      checkComplete.userProfileURL = true;
    }
    if (req.user.coverImageURL !== undefined) {
      checkComplete.coverImageURL = true;
    }
    if (req.user.interests.length !== 0) {
      checkComplete.interests = true;
    }

    const currentUser = {
      personalInformation: {
        name: req.user.personalInformation.name,
        DOB: req.user.personalInformation.DOB,
        birthPlace: req.user.personalInformation.birthPlace,
        currentCity: req.user.personalInformation.currentCity,
        profession: req.user.personalInformation.profession
      },
      contactDetails: {
        email: req.user.contactDetails.email,  //unique
        phone: req.user.contactDetails.phone   //unique
      },
      checkComplete: checkComplete,
      interests: req.user.interests,
      Bio: req.user.Bio,
      profileImageURL: req.user.profileImageURL,
      coverImageURL: req.user.coverImageURL,
      userProfileURL: req.user.userProfileURL,
      community: req.user.community
    };
    res.send(currentUser);
  } else {
    res.send(401);
  }
}

//login

const login = (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.status(400).json({isLoggedIn: false, message: info.message });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({isLoggedIn: true});
    });
  })(req, res, next);
};


module.exports = {
  addUser,
  sendUser,
  editUser,
  login,
};