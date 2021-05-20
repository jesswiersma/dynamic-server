const Express = require('express');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const router = Express.Router();
const {UserModel} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateJWT = require("../middleware/validate-jwt");

/*====================
   practice route
====================*/

router.get("/practice", (req, res) => {
    res.send("Hey! This is a practice route in userController!")
});

router.get("/about", (req, res) => {
    res.send("This is the about route under userController")
})

/*==========================
register user route - POST
============================*/

router.post("/register", async (req, res ) => {
    const {firstName, lastName, email, password, organization} = req.body

    try{
        const User = await UserModel.create({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 13),
        organization,
        isAdmin: false,
    });

    let token = jwt.sign({id: User.id, email: User.email}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

    res.status(201).json({
        message: "User successfully registered",
        user: User,
        sessionToken: token
    });
    } catch (err){
        if (err instanceof UniqueConstraintError){
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
      res.status(500).json({
        message: "Failed to register user",
    });
    }
    }
});

/*==========================
login user route - POST
============================*/

router.get("/", validateJWT, (req, res) => {
    res.status(200).json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        
      },
    });
  });


router.post("/login", async (req, res) => {
    let {email, password} = req.body;

    try{
    let loginUser = await UserModel.findOne({
        where: {
            email: email,
        },
    });
    console.log("Here you are")

    if(loginUser){

    let passwordComparison = await bcrypt.compare(password, loginUser.password);

     if (passwordComparison) {   

     let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
    console.log(loginUser.id)
      res.status(200).json({
        user: loginUser,
        message: "User successfully logged in!",
        sessionToken: token,
        
    });
    console.log("now here")
} else {
    res.status(401).json({
        message: "Incorrect email or password"
    })
}
    } else {
      res.status(401).json({
        message: "Incorrect email or password"
     });
    }
    } catch (error) {
    res.status(500).json({
        message: "Failed to log user in"
    });
}
});



module.exports = router;