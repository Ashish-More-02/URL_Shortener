const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUser ,getUser} = require("../service/auth");

async function handleUserSignup(req, res) {
  // when we send our form data to this route means "/user" ,
  // so the data will be sent like this name = value , email  = value , password = value
  // this name , eamil , password is 'name' for 'input box'
  const { name, email, password } = req.body;

  // we can do validations here

  await User.create({
    name,
    email,
    password,
  });

  return res.redirect("/login");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  // we can do validations here

  const user = await User.findOne({
    email,
    password,
  });

  console.log(user);

  if (!user) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  }

  const sessionId = uuidv4();
  setUser(sessionId , user);
  res.cookie("uid", sessionId);
  return res.redirect("/");
}

module.exports = { handleUserSignup, handleUserLogin };
