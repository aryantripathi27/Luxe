const express = require("express");
const router = express.Router();


//index route -- Users
router.get("/", (req,res)=> {
    res.send ("get for users");
});


//show users
router.get("/:id", (req,res)=> {
    res.send ("get for id");
});

//post Users
router.post("/", (req,res)=> {
    res.send ("Post for users");
});

//Delete for users
router.delete("/:id", (req,res)=> {
    res.send ("delete for users");
});

module.exports = router;