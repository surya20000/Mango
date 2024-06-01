import express from "express";
import { home,addUser, updateUser } from "../controllers/users.controllers.js";

const router = express.Router();

router.get("/home", home);

router.post("/signIn", addUser)

router.put("/updateUser/:id", updateUser)

export default router;
