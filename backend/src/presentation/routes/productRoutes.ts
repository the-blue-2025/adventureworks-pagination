import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts.bind(productController));
router.get('/search', productController.searchProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.get('/:id/inventory', productController.getProductInventory.bind(productController));
router.get('/:id/price-history', productController.getProductPriceHistory.bind(productController));

export default router;
