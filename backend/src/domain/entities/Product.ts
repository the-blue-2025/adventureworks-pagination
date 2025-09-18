import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

export interface ProductAttributes {
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
  SellStartDate: Date;
  SellEndDate?: Date;
  DiscontinuedDate?: Date;
  rowguid: string;
  ModifiedDate: Date;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'ProductID' | 'rowguid' | 'ModifiedDate'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public ProductID!: number;
  public Name!: string;
  public ProductNumber!: string;
  public MakeFlag!: boolean;
  public FinishedGoodsFlag!: boolean;
  public Color?: string;
  public SafetyStockLevel!: number;
  public ReorderPoint!: number;
  public StandardCost!: number;
  public ListPrice!: number;
  public Size?: string;
  public SizeUnitMeasureCode?: string;
  public WeightUnitMeasureCode?: string;
  public Weight?: number;
  public DaysToManufacture!: number;
  public ProductLine?: string;
  public Class?: string;
  public Style?: string;
  public ProductSubcategoryID?: number;
  public ProductModelID?: number;
  public SellStartDate!: Date;
  public SellEndDate?: Date;
  public DiscontinuedDate?: Date;
  public rowguid!: string;
  public ModifiedDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ProductNumber: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    MakeFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    FinishedGoodsFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    Color: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    SafetyStockLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ReorderPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StandardCost: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false,
    },
    ListPrice: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: false,
    },
    Size: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    SizeUnitMeasureCode: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    WeightUnitMeasureCode: {
      type: DataTypes.CHAR(3),
      allowNull: true,
    },
    Weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    DaysToManufacture: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ProductLine: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    Class: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    Style: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    ProductSubcategoryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ProductModelID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    SellStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    SellEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DiscontinuedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rowguid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Product',
    schema: 'Production',
    timestamps: false,
  }
);

export default Product;
