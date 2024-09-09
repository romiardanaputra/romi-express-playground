import { Router } from "express";
import usersRouter from "../routes/users.js";

const router = Router();

router.use(usersRouter);

export default router;
