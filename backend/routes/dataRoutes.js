const express = require("express");
const router = express.Router();

router.get("/communities", async (req, res) => {
    console.log("/communities Fire");
    const communityData = [
    {
        communityName:"Music",
        communityDisc:"This Community is for Music Lovers. Music is the art of arranging sounds in time to produce a composition through the elements of melody, harmony, rhythm, and timbre. It is one of the universal cultural aspects of all human societies.",
        communityImage: "https://media.istockphoto.com/vectors/irish-musical-instruments-vector-id1030267640?k=6&m=1030267640&s=612x612&w=0&h=hacpr8xGttaLKOflRJMHt8h_Mdrqoqldl6Mz8PKBePg="
    },
    {
        communityName:"Dance",
        communityDisc:"This Community is for them who loves evry type of art. Dance is a performing art form consisting of sequences of movement, either improvised or purposefully selected.",
        communityImage:"https://danceparent101.com/wp-content/uploads/2019/04/Commercial-Dance-e1554261136459.jpg"

    },
    {
        communityName:"Pantings",
        communityDisc:"Painting is the practice of applying paint, pigment, color or other medium to a solid surface. The medium is commonly applied to the base with a brush, but other implements, such as knives, sponges, and airbrushes, can be used.",
        communityImage: "https://i.pinimg.com/originals/4e/bd/6a/4ebd6ad335f427864cd44302fab6ff39.jpg"
    },
    {
        communityName:"Coding",
        communityDisc:"This Community is for programmers. Computer programming is the process of designing and building an executable computer program to accomplish a specific computing result or to perform a specific task.",
        communityImage: "https://ih1.redbubble.net/image.1368223620.8065/ur,pin_large_front,square,600x600.u2.jpg"

    },
    {
        communityName:"Computer Science",
        communityDisc:"This Community is dedicated to computer science"

    },
    {
        communityName:"Photography",
        communityDisc:"This Community is for Photographers"

    },
    {
        communityName:"Market News",
        communityDisc:"This Community provides you the recent news related to market and business"

    },
    {
        communityName:"Artworks",
        communityDisc:"Art is the best why to educate the pepole"

    },
    {
        communityName:"Books",
        communityDisc:"Books are human's best friend"

    },
    {
        communityName:"Novels",
        communityDisc:"Literature teachs you to express yourself in better way"

    },
    {
        communityName:"Sports",
        communityDisc:"Motivetes you, Keep Your Mind calm and happy"

    },
    {
        communityName:"Cricket",
        communityDisc:"Cricket Lovers are here"

    },
    {
        communityName:"Football",
        communityDisc:"The best outdoor game"

    },
    {
        communityName:"Travel",
        communityDisc:"Travelling gives you excelent experience"

    },
    {
        communityName:"Science",
        communityDisc:"Everything around us is for a reason"

    },
    {
        communityName:"Mathematics",
        communityDisc:"Mathematics can define this whole world"

    },
    {
        communityName:"Motivation",
        communityDisc:"Inner motivation gives you the real fire"

    },
    {
        communityName:"Gym",
        communityDisc:"A healthy mind inside a fit body"

    },
    {
        communityName:"Technology",
        communityDisc:"Technology is changing this world everyday"

    },
    {
        communityName:"Business",
        communityDisc:"Everything around us is business"

    },
    {
        communityName:"Poltics",
        communityDisc:"Poltics defines the future of the nation"

    },
]

res.json(communityData);
  
});

  module.exports = router;