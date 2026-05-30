import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// TODO: Implement subscription controllers
router.get("/", (req, res) => {
  res.json({ message: "List subscription plans - To be implemented" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "Get plan details - To be implemented" });
});

router.use(authenticate);

router.post("/", (req, res) => {
  res.json({ message: "Create subscription - To be implemented" });
});

router.get("/user/subscriptions", (req, res) => {
  res.json({ message: "Get user subscriptions - To be implemented" });
});

router.patch("/:id", (req, res) => {
  res.json({ message: "Update subscription - To be implemented" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "Cancel subscription - To be implemented" });
});

export default router;
