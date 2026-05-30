import { Router } from "express";
import productController from "../controllers/ProductController.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

router.get("/", (req, res, next) => productController.getAll(req, res).catch(next));
router.get("/featured", (req, res, next) =>
  productController.getFestivalSpecials(req, res).catch(next)
);
router.get("/trending", (req, res, next) =>
  productController.getTrending(req, res).catch(next)
);
router.post("/search", (req, res, next) =>
  productController.search(req, res).catch(next)
);
router.get("/:id", (req, res, next) => productController.getById(req, res).catch(next));
router.get("/:id/related", (req, res, next) =>
  productController.getRelated(req, res).catch(next)
);

// Admin routes
router.post("/", authenticate, (req, res, next) =>
  productController.create(req, res).catch(next)
);
router.patch("/:id", authenticate, (req, res, next) =>
  productController.update(req, res).catch(next)
);
router.delete("/:id", authenticate, (req, res, next) =>
  productController.delete(req, res).catch(next)
);

export default router;
