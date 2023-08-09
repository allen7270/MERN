const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course router ...");
  next();
});

// get all courses
router.get("/", async (req, res) => {
  // populate -> query object(thenable object)
  try {
    let coursesFound = await Course.find()
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// get by instructor id
router.get("/instructor/:_instructor_id", async (req, res) => {
  try {
    let { _instructor_id } = req.params;
    let coursesFound = await Course.find({ instructor: _instructor_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {}
});

// get by student id
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// get by course id
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 新增課程
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
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send({
      msg: "新課程已保存",
      savedCourse,
    });
  } catch (e) {
    return res.status(500).send("無法創建課程...");
  }
});

// 更改課程
router.patch("/:_id", async (req, res) => {
  // 驗證數據
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("查無此課程");
    }
    // 使用者 == 課程講師
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({ msg: "更新成功", updatedCourse });
    } else {
      return res.status(403).send("只有此課程講師可以更新");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("查無此課程");
    }
    // 使用者 == 課程講師
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send({ msg: "刪除成功" });
    } else {
      return res.status(403).send("只有此課程講師可以刪除");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
