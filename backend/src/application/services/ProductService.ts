import { Product } from '../../domain/entities/Product';
import { IProductRepository, ProductSearchCriteria, ProductSearchResult } from '../../domain/repositories/IProductRepository';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';

export class ProductService {
  private productRepository: IProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(criteria?: ProductSearchCriteria): Promise<ProductSearchResult> {
    return await this.productRepository.findAll(criteria);
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  async searchProducts(criteria: ProductSearchCriteria): Promise<ProductSearchResult> {
    return await this.productRepository.search(criteria);
  }
}
