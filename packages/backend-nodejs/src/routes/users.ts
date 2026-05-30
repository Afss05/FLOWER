import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// All user routes require authentication
router.use(authenticate);

// TODO: Implement user controllers
router.get("/profile", (req, res) => {
  res.json({ message: "Get user profile - To be implemented" });
});

router.patch("/profile", (req, res) => {
  res.json({ message: "Update profile - To be implemented" });
});

router.get("/addresses", (req, res) => {
  res.json({ message: "Get addresses - To be implemented" });
});

router.post("/addresses", (req, res) => {
  res.json({ message: "Add address - To be implemented" });
});

router.patch("/addresses/:id", (req, res) => {
  res.json({ message: "Update address - To be implemented" });
});

router.delete("/addresses/:id", (req, res) => {
  res.json({ message: "Delete address - To be implemented" });
});

router.get("/wishlist", (req, res) => {
  res.json({ message: "Get wishlist - To be implemented" });
});

router.post("/wishlist/:productId", (req, res) => {
  res.json({ message: "Add to wishlist - To be implemented" });
});

router.delete("/wishlist/:productId", (req, res) => {
  res.json({ message: "Remove from wishlist - To be implemented" });
});

export default router;
