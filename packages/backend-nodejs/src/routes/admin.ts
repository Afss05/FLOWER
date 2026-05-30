import { Router } from "express";
import { authenticate, authorize } from "../middleware/authenticate.js";

const router: Router = Router();

// All admin routes require admin role
router.use(authenticate);
router.use(authorize("admin", "super_admin"));

// TODO: Implement admin controllers
router.get("/dashboard", (req, res) => {
  res.json({ message: "Dashboard stats - To be implemented" });
});

router.get("/orders", (req, res) => {
  res.json({ message: "List all orders - To be implemented" });
});

router.patch("/orders/:id", (req, res) => {
  res.json({ message: "Update order status - To be implemented" });
});

router.get("/analytics", (req, res) => {
  res.json({ message: "Analytics data - To be implemented" });
});

router.post("/coupons", (req, res) => {
  res.json({ message: "Create coupon - To be implemented" });
});

router.post("/delivery-slots", (req, res) => {
  res.json({ message: "Manage delivery slots - To be implemented" });
});

export default router;
