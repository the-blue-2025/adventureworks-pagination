import { Request, Response } from 'express';
import { ProductService } from '../../application/services/ProductService';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const criteria = {
        name: req.query.name as string,
        productNumber: req.query.productNumber as string,
        color: req.query.color as string,
        productLine: req.query.productLine as string,
        class: req.query.class as string,
        style: req.query.style as string,
        size: req.query.size as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortBy: req.query.sortBy as any,
        sortDir: req.query.sortDir as any
      };

      const result = await this.productService.getAllProducts(criteria);
      res.json(result);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const criteria = {
        name: req.query.name as string,
        productNumber: req.query.productNumber as string,
        color: req.query.color as string,
        productLine: req.query.productLine as string,
        class: req.query.class as string,
        style: req.query.style as string,
        size: req.query.size as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortBy: req.query.sortBy as any,
        sortDir: req.query.sortDir as any
      };

      const result = await this.productService.searchProducts(criteria);
      res.json(result);
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProductInventory(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const inventory = await this.productService.getProductInventory(productId);
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching product inventory:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProductPriceHistory(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const priceHistory = await this.productService.getProductPriceHistory(productId);
      res.json(priceHistory);
    } catch (error) {
      console.error('Error fetching product price history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
