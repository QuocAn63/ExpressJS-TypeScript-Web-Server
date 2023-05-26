import express, { Router } from "express";
import {
  todoHome,
  todoLogin,
  todoRegister,
} from "../../controllers/todo.controller";

const router: Router = express.Router();

router.get("/login", todoLogin);
router.get("/register", todoRegister);
router.get("/", todoHome);

export default router;
