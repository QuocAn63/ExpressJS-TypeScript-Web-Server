import express from "express";
import { getAllUsers, getUser } from "../../controllers/user";

const router = express.Router();

router.get("/users/:username", getUser);
router.put("/users/:username");
router.get("/users", getAllUsers);
export default router;
