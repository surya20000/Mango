import User from "../models/users.model.js";
import jwt from "jsonwebtoken";

export const home = (req, res) => {
  try {
    res.status(200).send("Hello Chat App");
  } catch (error) {
    console.log(error.message);
  }
};

export const addUser = async (req, res) => {
  console.log("route hit");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      res.send({ token, user });
    } else {
      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.image,
      });
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      res.status(200).send({ token, user });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  console.log("route hit");
  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
