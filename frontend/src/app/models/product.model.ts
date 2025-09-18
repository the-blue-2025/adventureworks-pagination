export interface Product {
  ProductID: number;
  Name: string;
  ProductNumber: string;
  MakeFlag: boolean;
  FinishedGoodsFlag: boolean;
  Color?: string;
  SafetyStockLevel: number;
  ReorderPoint: number;
  StandardCost: number;
  ListPrice: number;
  Size?: string;
  SizeUnitMeasureCode?: string;
  WeightUnitMeasureCode?: string;
  Weight?: number;
  DaysToManufacture: number;
  ProductLine?: string;
  Class?: string;
  Style?: string;
  ProductSubcategoryID?: number;
  ProductModelID?: number;
  SellStartDate: string;
  SellEndDate?: string;
  DiscontinuedDate?: string;
  rowguid: string;
  ModifiedDate: string;
}

export interface ProductSearchCriteria {
  name?: string;
  productNumber?: string;
  color?: string;
  productLine?: string;
  class?: string;
  style?: string;
  size?: string;
  page?: number;
  limit?: number;
  sortBy?: 'ProductID' | 'Name' | 'ProductNumber' | 'Color' | 'ListPrice' | 'Size' | 'Weight' | 'SellStartDate';
  sortDir?: 'asc' | 'desc';
}

export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
