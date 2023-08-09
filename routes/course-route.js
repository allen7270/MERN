const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course router ...");
  next();
});

router.post("/", async (req, res) => {
  // 驗證數據
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res.status(400).send("只有講師才可發佈新課程");
  }

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.body._id,
    });
    let savedCourse = await newCourse.save();
    return res.send({
      msg: "新課程以保存",
      savedCourse,
    });
  } catch (e) {
    return res.status(500).send("無法創建課程...");
  }
});

module.exports = router;
