const Express = require("express");
const router = Express.Router();
const { ScheduleModel } = require("../models");
let validateJWT = require("../middleware/validate-jwt");

/*
====================
practice route
====================
*/

router.get("/practice", (req, res) => {
    res.send("Hey! I'm a working practice route!")
});

/* WORKING
=============================
Get ALL SCHEDULE - main view
=============================
*/

router.get("/", async (req, res) => {
    try {
        const schedules = await ScheduleModel.findAll();
        res.status(200).json(schedules);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*  WORKING 
====================
Get Schedule - single day detail view
====================
*/

router.get("/:id", async (req, res) => {
    try {
      const schedule = await ScheduleModel.findAll({
        where: {
          id: req.params.id,
          
        },
      });
  
      res.status(200).json({
        message: "Got it!",
        schedule,
      });
    } catch (err) {
      res.status(500).json({
        message: `Failed to retrieve the schedule: ${err}`,
      });
    }
  });

  
module.exports = router;