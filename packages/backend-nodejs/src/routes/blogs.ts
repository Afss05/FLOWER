import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// TODO: Implement blog controllers
router.get("/", (req, res) => {
  res.json({ message: "List blogs - To be implemented" });
});

router.get("/:slug", (req, res) => {
  res.json({ message: "Get blog by slug - To be implemented" });
});

router.get("/category/:slug", (req, res) => {
  res.json({ message: "Get blogs by category - To be implemented" });
});

router.post("/:id/reviews", authenticate, (req, res) => {
  res.json({ message: "Add blog comment - To be implemented" });
});

export default router;
