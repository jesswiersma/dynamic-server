const router = require("express").Router();
const {AdminModel, AnnouncementModel} = require("../models");
const {ScheduleModel} = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
//const validateJWTAdmin = require("../middleware/validate-jwtAdmin");


///Test Route///

router.get("/test", (req, res) => {
    res.send("hello")
})

/* WORKING
===============================
         Admin Register
===============================
*/
router.post("/register", async(req, res) => {
    const {firstName, lastName, email, password, organization} = req.body.admin;

    try{
        const Admin = AdminModel.create({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 13),
        organization
    })

        let token = jwt.sign({id: Admin.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

    res.status(201).json({
        message: "Admin successfully registered",
        admin: Admin,
        sessionToken: token
    });
    
    } catch (err){
        if (err instanceof UniqueConstraintError){
        res.status(409).json({
            message: "Email already in use",
            });
        } else {
      res.status(500).json({
        message: "Failed to register admin",
    });
    }
    }
});

/* WORKING
===============================
         Admin Login
===============================
*/
router.post("/login", async (req, res) => {
    const {email, password} = req.body.admin;

    try{
    let loginUser = await AdminModel.findOne({
        where: {
            email: email,
        },
    });

    if(loginUser){

    let passwordComparison = await bcrypt.compare(password, loginUser.password);

     const token = jwt.sign({id: Admin.id}, process.env.JWT_SECRET);

     if (passwordComparison) {   

      res.status(200).json({
        user: loginUser,
        message: "Admin successfully logged in!",
        sessionToken: token
    });
} else {
    res.status(401).json({
        message: "Incorrect email or password #1"
    })
}
    } else {
      res.status(401).json({
        message: "Incorrect email or password #2"
     });
    }
    } catch (error) {
    res.status(500).json({
        message: "Failed to log admin in"
    });
}
});

/* WORKING
===============================
Admin Schedule Create - POST
===============================
*/ 

//Can't get validateJWTAdmin to work//

router.post("/schedule", async (req, res) => {
    //console.log("create schedule")
    const {day, date, startTime, endTime, type, location, description} = req.body.schedule;
   
    const scheduleEntry = {
        day,
        date,
        startTime,
        endTime,
        type,
        location,
        description,
    }

    try {
        const newScheduleEntry = await ScheduleModel.create(scheduleEntry);
        res.status(200).json(newScheduleEntry);
    } catch (err) {
        res.status(500).json({error: err})
    }
});


/* WORKING
===============================
    Update Schedule - PUT
===============================
*/

router.put("/schedule/update/:id", async (req, res) => {
    console.log("edit schedule")
    const {day, date, startTime, endTime, type, location, description} = req.body.schedule;
    const scheduleId = req.params.id;
   
    const query = {
        where: {
            id: scheduleId,
        }
    };
    
    const updatedSchedule = {
        day,
        date,
        startTime,
        endTime,
        type,
        location,
        description
    };
   
    try {
        const update = await ScheduleModel.update(updatedSchedule, query);
        res.status(200).json({updatedSchedule, message: "Schedule updated!"});
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/* WORKING
===============================
  Delete a Schedule - DELETE
===============================
*/
 router.delete("/schedule/delete/:id", async (req, res) => {
     const scheduleId = req.params.id;

     try {
         const query = {
             where: {
                 id: scheduleId,
             }
         };

         await ScheduleModel.destroy(query);
         res.status(200).json({message: "Schedule Deleted"});
     } catch (err) {
         res.status(500).json({error: err});
     }    
 });



/* WORKING - without validateJWTAdmin
===============================
Admin Announcement Create - POST
===============================
*/ 

router.post("/announcement", async (req, res) => {
    console.log("create announcement")
    const {title, date, description, response} = req.body.announcement;
   
    const announcementEntry = {
        title,
        date,
        description,
        response
    }

    try {
        const newAnnouncementEntry = await AnnouncementModel.create(announcementEntry);
        res.status(200).json(newAnnouncementEntry);
    } catch (err) {
        res.status(500).json({error: err})
    }
});

/* WORKING
===============================
    Update Announcement - PUT
===============================
*/

router.put("/announcement/update/:id", async (req, res) => {
    console.log("you are here");
    const {title, date, description, response} = req.body.announcement;
    const announcementId = req.params.id;

    const query = {
        where: {
            id: announcementId,
        }
    };
    console.log("You are here #2");
    const updatedAnnouncement = {
        title,
        date,
        description,
        response,
    };
    try {
        const update = await AnnouncementModel.update(updatedAnnouncement, query);
        res.status(200).json({update, message: "update successful!"})
    } catch (err) {
        res.status(500).json({error: err});
    }
});
   

/* WORKING
===============================
  Delete an Announcement - DELETE
===============================
*/
router.delete("/announcement/delete/:id", async (req, res) => {
    const announcementId = req.params.id;

    try {
        const query = {
            where: {
                id: announcementId,
            }
        };

        await AnnouncementModel.destroy(query);
        res.status(200).json({message: "Announcement Deleted"});
    } catch (err) {
        res.status(500).json({error: err});
    }    
});


module.exports = router;