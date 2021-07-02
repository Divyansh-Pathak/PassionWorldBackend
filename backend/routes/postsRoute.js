const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = require('../config/gridStorage');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Post = require('../models/posts');
const crypto = require("crypto");
const User = require("../models/user");
const passport = require('passport');

const connection = mongoose.connection;

let gfs;

connection.once('open', () => {
  // Init stream
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  res.json({server: "Run successFully"})
})


router.post('/uploadProfileImage', upload.single('file'), async (req, res) => {

  let filename = req.file.filename;

  gfs.remove({filename: req.user.profileImageURL , root: "uploads"}, (err, gridStore)=>{
    if(err){
      console.log(err);
    }
  });

  await User.findByIdAndUpdate(req.user._id, { profileImageURL: filename },
    function (err, docs) {
      if (err) {
        res.status(400).json({isProfileUpdated: false});
      }
      else {
        res.status(200).json({isProfileUpdated: true});
      }
    });

});



// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', upload.array('files'), async (req, res) => {

  let filenameAsId = req.files[0].filename;
  let fileNames = [];
  let contentType = [];
  for (let i = 0; i < req.files.length; i++) {
    fileNames.push(`/image/${req.files[i].filename}`);
    contentType.push(req.files[i].contentType);
  }
  const postDetails = new Post(
    {
      isMedia: true,
      postID: filenameAsId,
      fileType: contentType,
      postFileURL: fileNames, //to be set
      caption: req.body.caption,
      likes: [],
      dislikes: 0,
      uploadedBy: {
        userName: req.user.personalInformation.name,
        currentCity: req.user.personalInformation.currentCity,
        profileImageURL: req.user.profileImageURL,
        userProfileURL: req.user.userProfileURL,
        userEmail: req.user.contactDetails.email,
      },
      userProfileURL: "http://www.google.com",
      views: 0,
      date: new Date(),
      tags: req.body.tags
    });
  postDetails.save();

  res.json({ fileNames });




});

router.post('/uploadText', async (req, res) => {


  let filename = crypto.randomBytes(32).toString('hex');


  const postDetails = new Post(
    {
      isMedia: false,
      postID: filename,
      fileType: "text",
      caption: req.body.caption,
      likes: [],
      dislikes: 0,
      uploadedBy: {
        userName: req.user.personalInformation.name,
        currentCity: req.user.personalInformation.currentCity,
        profileImageURL: req.user.profileImageURL,
        userProfileURL: req.user.userProfileURL,
        userEmail: req.user.contactDetails.email,
      },
      views: 0,
      date: new Date(),
      tags: req.body.tags
    });
  postDetails.save();

  res.json({ filename });


});

router.post('/multipleUpload', upload.array('files'), async (req, res) => {
  console.log("Array should be here bu multer", req.body);
  console.log("Array file", req.files);
  res.json({ file: req.files, body: req.body });
});




//@update like

router.post("/like", async (req, res) => {
  const filter = { postID: req.body.postID };
  let result = await Post.findOne(filter);
  if (req.body.isLiked) {
    console.log({ condition: req.body.isLiked });
    result.likes.push(req.user.contactDetails.email);

  } else {
    console.log({ condition: result.likes });
    result.likes = result.likes.filter((email) => email !== req.user.contactDetails.email);

  }

  result.save().then(() => {

    res.json({ likeRequest: "successfull" });

  }).catch(err => res.json({ likeRequest: "unsuccessfull" }))


});


//@update Comment

router.post("/comment", async (req, res) => {
  const filter = { postID: req.body.postID };
  let result = await Post.findOne(filter);
  result.CommentBox.push({
    commentByUser: {
      userName: req.user.personalInformation.name,
      currentCity: req.user.personalInformation.currentCity,
      profileImageURL: req.user.profileImageURL,
      userProfileURL: req.user.userProfileURL,
      userEmail: req.user.contactDetails.email,
    },
    comment: req.body.comment
  });
  await result.save();
  res.json("Comment Uploaded");

});



// @route GET /files
// @desc  Display all files in JSON
router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

router.get('/posts', async (req, res) => {

  const defaultChecker = ["Photography", "Reading Books", "Music", "Dance", "Coding", "Computer Science", "Books", "Novels",
  "Sports", "Cricket", "Football", "Travel", "Science", "Mathematics", "Motivation", "Gym", "Technology", "Politics"];

  let checker = req.user.interests;
  // if(req.isAuthenticated){
  //   checker = req.user.interests;

  // }else{

    // checker = defaultChecker;

  // }
  


  const filter = { tags: { $in: checker } };

  const post = await Post.find(filter);

  if (!post || post.length === 0) {
    res.status(404).json({
      err: "NO POST YET"
    });
  } else {


    return res.json(post);
  }
});

router.get('/communitypost/:communityName', async (req, res) => {


   const { communityName } = req.params;
  
  const selector = {tags: { $in: communityName }}
  const post = await Post.find(selector);
  if (!post || post.length === 0) {
    res.status(404).json({
      err: "NO POST YET"
    });
  } else {


    return res.json(post);
  }
});

router.get('/userPost', async (req, res) => {


 

  // await User.find({"contactDetails.email": userEmail}).then((user) => {
  //   console.log(user);

  //   return res.json(user);
  // });

  let userEmail = req.user.contactDetails.email;

  
  
  const selector = {"uploadedBy.userEmail": userEmail}
  const post = await Post.find(selector);
  if (!post || post.length === 0) {
    res.status(404).json({
      err: "NO POST YET"
    });
  } else {


    return res.json(post);
  }
});

// @route GET /image/:filename
// @desc Display Image
router.get('/posts/:postID', async (req, res) => {

  const post = await Post.findById(req.params.postID);


  // gfs.files.findOne({ filename: post.postFileName }, (err, file) => {
  //   // Check if file
  //   if (!file || file.length === 0) {
  //     return res.status(404).json({
  //       err: 'No file exists'
  //     });
  //   }

  //   // Check if image
  //   if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
  //     // Read output to browser
  //     const readstream = gfs.createReadStream(file.filename);
  //     readstream.pipe(res);
  //   }
  //    else {
  //     res.status(404).json({
  //       err: 'Not an image'
  //     });
  //   }
  // });
});



router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'video/mp4') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
      // readstream.on('data', (chunk) => {
      //   res.render('newHandlebarFile', { image: chunk.toString('base64') });
      // });
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});


module.exports = router;
