import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// TODO: Implement payment controllers
router.post("/razorpay", authenticate, (req, res) => {
  res.json({ message: "Create Razorpay order - To be implemented" });
});

router.post("/verify", authenticate, (req, res) => {
  res.json({ message: "Verify payment - To be implemented" });
});

router.get("/:id", authenticate, (req, res) => {
  res.json({ message: "Get payment details - To be implemented" });
});

router.post("/:id/refund", authenticate, (req, res) => {
  res.json({ message: "Request refund - To be implemented" });
});

export default router;
