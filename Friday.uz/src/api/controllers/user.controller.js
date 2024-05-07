const Users = require("../../models/user.model");
const bcrypt = require("../../libs/bcrypt");
const jwt = require("../../libs/jwt");
const { promisify } = require("util");
const nodemailer = require("nodemailer");
const Redis = require("ioredis");
const { generateHash, comparePass } = require("../../libs/bcrypt");
const { nextTick } = require("process");
const authValidation = require("../validations/auth.validation");
const CustomError = require("../../libs/customError");
const verificationValidation = require("../validations/verify.validation");
const loginValidation = require("../validations/login.validation");

const redis = new Redis({
  port: 6379,
  host: "127.0.0.1",
  password: "1234",
});

const register = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;

    const validationError = authValidation({
      username,
      password,
      fullname,
      email,
    });
    if (validationError) throw new CustomError(400, validationError.message);

    const generate = await generateHash(password);
    const findUser = await Users.findAll({
      where: { email: email, username: username },
      logging: false,
    });

    if (findUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
    redis.get("codes", async (err, data) => {
      if (data) {
        throw new CustomError(500, "Internal Error");
      } else {
        const verifyCode = Math.floor(Math.random() * 9000) + 1000;
        console.log(verifyCode);

        const time = 60;

        await redis.set("codes", JSON.stringify(verifyCode), "EX", time);
        await redis.set("fullname", JSON.stringify(fullname), "EX", time);
        await redis.set("username", JSON.stringify(username), "EX", time);
        await redis.set("email", JSON.stringify(email), "EX", time);
        await redis.set("generate", JSON.stringify(generate), "EX", time);

        const transporter = nodemailer.createTransport({
          port: 465,
          host: "smtp.gmail.com",
          auth: {
            user: "nasirullayevo7@gmail.com",
            pass: "smenmggcgonbqmwl",
          },
          secure: true,
        });
        const mailData = {
          from: "nasirullayevo7@gmail.com",
          to: email,
          subject: "Verification code",
          text: `Verification code`,
          html: `<b>Login code:${verifyCode}</b><br> Do not give this code to anyone<br/>`,
        };

        await transporter.sendMail(mailData);
        res.status(200).json({
          message:
            "Successfully verifacation password sent. Please show your email code and You will send me...",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const validationError = loginValidation({
      username,
      password,
    });

    if (validationError) throw new CustomError(400, validationError.message);

    const findUser = await Users.findAll(
      { where: { username: username } },
      { logging: false }
    );

    if (findUser.length < 1) {
      throw new CustomError(
        404,
        "Invalid username or password provided for login"
      );
    }
    const compare = await comparePass(password, findUser[0].password);

    if (!compare) {
      throw new CustomError(404, "Invalid password provided to login");
    }

    const token = jwt.sign({ id: findUser[0].id });

    res.cookie("token", token);

    res.status(201).json({ message: `Welcome`, token: token });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verification } = req.body;

    const validationError = verificationValidation({
      verification,
    });
    if (validationError) throw new CustomError(400, validationError.message);

    const storedCode = await new Promise((resolve, reject) => {
      redis.get("codes", (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    if (verification != storedCode) {
      throw new CustomError(400, "Invalid code");
    }

    const [generate, email, fullname, username] = await Promise.all([
      promisify(redis.get).bind(redis)("generate"),
      promisify(redis.get).bind(redis)("email"),
      promisify(redis.get).bind(redis)("fullname"),
      promisify(redis.get).bind(redis)("username"),
    ]);
    const newUser = await Users.create({
      fullname: JSON.parse(fullname),
      username: JSON.parse(username),
      email: JSON.parse(email),
      password: JSON.parse(generate),
    });

    const token = jwt.sign({ id: newUser.id });
    res.cookie("token", token);

    res.status(201).json({ message: "User created", token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const getUsers = async (req, res, next) => {
  try {
    const user = await Users.findAll({
      attributes: { exclude: ["password"] },
      logging: false,
    });
    if (user.length < 1) throw new CustomError(404, "Users not found");

    res.status(200).json({ message: "SUCCES", user });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new CustomError(404, "Invalid id");
    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
      logging: false,
    });
    if (!user) throw new CustomError(404, "Seller not found");

    res.status(200).json({ message: "Success", user });
  } catch (error) {
    next(error);
  }
};
module.exports = { register, login, verify, getUser,getUsers };
