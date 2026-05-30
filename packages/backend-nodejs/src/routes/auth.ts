import { Router } from "express";
import authController from "../controllers/AuthController.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

router.post("/register", (req, res, next) => authController.register(req, res).catch(next));
router.post("/login", (req, res, next) => authController.login(req, res).catch(next));
router.post("/refresh", authenticate, (req, res, next) =>
  authController.refresh(req, res).catch(next)
);
router.get("/me", authenticate, (req, res, next) =>
  authController.getCurrentUser(req, res).catch(next)
);

export default router;
