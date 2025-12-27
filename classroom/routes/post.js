const express = require("express");
const router = express.Router();


//index route -- Posts
router.get("/", (req,res)=> {
    res.send ("get for posts");
});


//show posts
router.get("/:id", (req,res)=> {
    res.send ("get for posts id");
});

//post posts
router.post("/", (req,res)=> {
    res.send ("Post for posts");
});

//Delete for posts
router.delete("/:id", (req,res)=> {
    res.send ("delete for posts");
});


module.exports = router;