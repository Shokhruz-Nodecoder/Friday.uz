const Seller = require("../../models/seller.model");
const bcrypt = require("../../libs/bcrypt");
const jwt = require("../../libs/jwt");
const { promisify } = require("util");
const nodemailer = require("nodemailer");
const Redis = require("ioredis");
const { generateHash, comparePass } = require("../../libs/bcrypt");
const { nextTick } = require("process");
const CustomError = require("../../libs/customError");
const verificationValidation = require("../validations/verify.validation");
const sellerValidation = require("../validations/seller.validation");
const login2Validation = require("../validations/seller.login.validation");

const redis = new Redis({
  port: 6379,
  host: "127.0.0.1",
    password: "1234",
});

const register = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phone_number,
      company_name,
      INN,
    } = req.body;

    const validationError = sellerValidation({
      firstname,
      password,
      lastname,
      phone_number,
      company_name,
      INN,
      email,
    });
    if (validationError) throw new CustomError(400, validationError.message);

    const generate = await generateHash(password);

    const findUser = await Seller.findAll({
      where: { email:email, phone_number : phone_number},
      logging: false,
    });

    console.log(findUser);
    if (findUser.length > 0) {
      return res.status(409).json({ message: "Student already exists" });
    }
    redis.get("sellers", async (err, data) => {
      if (data) {
        throw new CustomError(500, "Internal Error");
      } else {
        const verifyCode = Math.floor(Math.random() * 9000) + 1000;
        console.log(verifyCode);

        const time = 60;

        await redis.set("sellers", JSON.stringify(verifyCode), "EX", time);
        await redis.set("firstname", JSON.stringify(firstname), "EX", time);
        await redis.set("lastname", JSON.stringify(lastname), "EX", time);
        await redis.set(
          "company_name",
          JSON.stringify(company_name),
          "EX",
          time
        );
        await redis.set(
          "phone_number",
          JSON.stringify(phone_number),
          "EX",
          time
        );
        await redis.set("INN", JSON.stringify(INN), "EX", time);
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
    const { email, password } = req.body;

    const validationError = login2Validation({
      email,
      password,
    });

    if (validationError) throw new CustomError(400, validationError.message);

    const findUser = await Seller.findAll(
      { where: { email: email } },
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
      redis.get("sellers", (err, data) => {
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

    const [
      firstname,
      lastname,
      company_name,
      phone_number,
      INN,
      email,
      generate,
    ] = await Promise.all([
      promisify(redis.get).bind(redis)("firstname"),
      promisify(redis.get).bind(redis)("lastname"),
      promisify(redis.get).bind(redis)("company_name"),
      promisify(redis.get).bind(redis)("phone_number"),
      promisify(redis.get).bind(redis)("INN"),
      promisify(redis.get).bind(redis)("email"),
      promisify(redis.get).bind(redis)("generate"),
    ]);

    const newUser = await Seller.create({
      firstname: JSON.parse(firstname),
      lastname: JSON.parse(lastname),
      phone_number: JSON.parse(phone_number),
      company_name: JSON.parse(company_name),
      INN: JSON.parse(INN),
      email: JSON.parse(email),
      password: JSON.parse(generate),
    });

    const token = jwt.sign({ id: newUser.id });
    res.cookie("token", token);

    res.status(201).json({ message: "Seller created", token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const getSellers = async (req, res, next) => {
  try {
    const seller = await Seller.findAll({
      attributes: { exclude: ["password"] },
      logging: false,
    });
    if (seller.length < 1) throw new CustomError(404, "Seller not found");

    res.status(200).json({ message: "SUCCES", seller });
  } catch (error) {
    next(error);
  }
};

const getOneSeller = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new CustomError(404, "Invalid id");

    const seller = await Seller.findByPk(id, {
      attributes: { exclude: ["password"] },
      logging: false,
    });
    if (!seller) throw new CustomError(404, "Seller not found");

    res.status(200).json({ message: "Success", seller });
  } catch (error) {
    next(error);
  }
};


module.exports = { register, login, verify, getSellers, getOneSeller };
