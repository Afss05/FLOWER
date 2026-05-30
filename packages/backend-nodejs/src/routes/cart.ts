import { Router } from "express";
import cartController from "../controllers/CartController.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get("/", (req, res, next) => cartController.getCart(req, res).catch(next));
router.post("/items", (req, res, next) => cartController.addItem(req, res).catch(next));
router.patch("/items/:id", (req, res, next) =>
  cartController.updateItem(req, res).catch(next)
);
router.delete("/items/:id", (req, res, next) =>
  cartController.removeItem(req, res).catch(next)
);
router.delete("/", (req, res, next) => cartController.clearCart(req, res).catch(next));

export default router;
