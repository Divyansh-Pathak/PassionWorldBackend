const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postID: String,
    fileType: [],
    postFileURL: [],
    caption: String,
    likes: [],
    dislikes: Number,
    CommentBox:[{
        commentByUser: {
            userName: String,
            currentCity: String,
            profileImageURL : String,
            userProfileURL: String,
    
        },
        comment: String,
        replyBox:[{
            replyByUser: String,
            reply: String,
            date: Date
        }],
        date: Date
    }],
    uploadedBy: {
        userName: String,
        currentCity: String,
        profileImageURL : String,
        userProfileURL: String,
        userEmail: String,

    },
    
    views: Number,
    date: Date,
    tags: []
});

const post = mongoose.model("post", postSchema);

module.exports = post;