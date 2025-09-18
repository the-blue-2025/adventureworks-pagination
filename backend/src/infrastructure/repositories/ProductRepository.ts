import { Op } from 'sequelize';
import { Product } from '../../domain/entities/Product';
import { IProductRepository, ProductSearchCriteria, ProductSearchResult } from '../../domain/repositories/IProductRepository';

export class ProductRepository implements IProductRepository {
  async findAll(criteria?: ProductSearchCriteria): Promise<ProductSearchResult> {
    const whereClause: any = {};

    if (criteria?.name) {
      whereClause.Name = {
        [Op.like]: `%${criteria.name}%`
      };
    }

    if (criteria?.productNumber) {
      whereClause.ProductNumber = {
        [Op.like]: `%${criteria.productNumber}%`
      };
    }

    if (criteria?.color) {
      whereClause.Color = {
        [Op.like]: `%${criteria.color}%`
      };
    }

    if (criteria?.productLine) {
      whereClause.ProductLine = {
        [Op.like]: `%${criteria.productLine}%`
      };
    }

    if (criteria?.class) {
      whereClause.Class = {
        [Op.like]: `%${criteria.class}%`
      };
    }

    if (criteria?.style) {
      whereClause.Style = {
        [Op.like]: `%${criteria.style}%`
      };
    }

    if (criteria?.size) {
      whereClause.Size = {
        [Op.like]: `%${criteria.size}%`
      };
    }

    const page = criteria?.page && criteria.page > 0 ? criteria.page : 1;
    const limit = criteria?.limit && criteria.limit > 0 ? criteria.limit : 25;
    const offset = (page - 1) * limit;

    const orderColumn = criteria?.sortBy ? criteria.sortBy : 'Name';
    const orderDirection = criteria?.sortDir === 'desc' ? 'DESC' : 'ASC';

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      order: [[orderColumn, orderDirection]],
      limit,
      offset
    });

    return {
      products: rows,
      totalCount: count,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(count / limit))
    };
  }

  async findById(id: number): Promise<Product | null> {
    return await Product.findByPk(id);
  }

  async search(criteria: ProductSearchCriteria): Promise<ProductSearchResult> {
    return this.findAll(criteria);
  }
}
