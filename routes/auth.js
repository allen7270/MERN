const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;

router.use((req, res, next) => {
  console.log("正在接收auth有關的請求...");
  next();
});

router.get("/test", (req, res) => {
  return res.send("成功連結auth route");
});

router.post("/register", async (req, res) => {
  // check data
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("信箱已被使用...");

  let { username, email, password, role } = req.body;
  let newUser = new User({ username, email, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({ msg: "使用者成功儲存", savedUser });
  } catch (e) {
    return res.status(500).send("無法儲存使用者");
  }
});

module.exports = router;
