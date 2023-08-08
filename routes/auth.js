const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;

router.use((req, res, next) => {
  console.log("正在接收auth有關的請求...");
  next();
});

router.get("/test", (req, res) => {
  return res.send("成功連結auth route");
});

router.post("/register", (req, res) => {
  console.log(registerValidation(req.body));
});

module.exports = router;
