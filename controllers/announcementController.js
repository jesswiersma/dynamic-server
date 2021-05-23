const Express = require('express');
const router = Express.Router();
const {AnnouncementModel} = require("../models");
const validateJWT = require("../middleware/validate-jwt");

/* WORKING
====================
Get ALL Announcements - main view
====================
*/
router.get("/", async (req, res) => {
    try {
      const announcements = await AnnouncementModel.findAll();
      res.status(200).json(announcements);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });


  /* WORKING
====================
Get Single Announcement - single item detail view
====================
*/
router.get("/:id", async (req, res) => {
    try {
      const announcement = await AnnouncementModel.findOne({
        where: {
          id: req.params.id,
        },
      });
  
      res.status(200).json({
        message: "Got it!",
        announcement,
      });
    } catch (err) {
      res.status(500).json({
        message: `Failed to retrieve the announcement: ${err}`,
      });
    }
  });


  
module.exports = router;