const express = require("express");
const router = express.Router();
const { validateUserDetails, validateEmail } = require("../Middlewares/validationMiddleware");
const {
  addUser,
  sendUser,
  editUser,
  login,
} = require("../routeHandlers/userHandler");


// router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success' }));
// router.post('/login', passport.authenticate('local', 

// function(err, user, info){
//   console.log({error: err , user: user , info: info});
//   if (err) { console.log({errorInLogin: err}); }
//   if (!user) { 
//     console.log(info);
//       res.status(401);
//       res.end(info);
//       return;
//   }
//   res.status(200).json({isLoggedIn: true})
//   //createSendToken(req.user, res);
// }));

router.post('/login', login);

router.post('/register', validateEmail, addUser);

router.post('/editProfile', validateUserDetails, editUser);

router.get('/logout', function (req, res) {
  req.logout();
  res.send("Logout Hogya");
});

router.get('/user', sendUser);

router.get('/', (req, res) => {
  res.send("Express is running");
});

router.get('/login-failure', (req, res) => {
  res.json({ isLoggedIn: false });
});

router.get('/login-success', (req, res) => {
  res.json({ isLoggedIn: true });
});


module.exports = router;
