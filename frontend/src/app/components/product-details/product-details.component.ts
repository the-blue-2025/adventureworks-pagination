import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, ProductInventory, ProductListPriceHistory } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
  // Signals for reactive state management
  private _product = signal<Product | null>(null);
  private _inventory = signal<ProductInventory[]>([]);
  private _priceHistory = signal<ProductListPriceHistory[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _activeTab = signal<'inventory' | 'priceHistory'>('inventory');

  // Readonly signals for template access
  product = this._product.asReadonly();
  inventory = this._inventory.asReadonly();
  priceHistory = this._priceHistory.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  activeTab = this._activeTab.asReadonly();

  // Computed signals
  hasInventory = computed(() => this._inventory().length > 0);
  hasPriceHistory = computed(() => this._priceHistory().length > 0);
  totalInventory = computed(() => 
    this._inventory().reduce((sum, item) => sum + item.Quantity, 0)
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
  }

  private loadProductDetails(productId: number): void {
    this._loading.set(true);
    this._error.set(null);

    // Load product details
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this._product.set(product);
        this.loadInventory(productId);
        this.loadPriceHistory(productId);
      },
      error: (error) => {
        this._error.set('Failed to load product details');
        this._loading.set(false);
        console.error('Error loading product:', error);
      }
    });
  }

  private loadInventory(productId: number): void {
    this.productService.getProductInventory(productId).subscribe({
      next: (inventory) => {
        this._inventory.set(inventory);
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this._inventory.set([]);
      }
    });
  }

  private loadPriceHistory(productId: number): void {
    this.productService.getProductPriceHistory(productId).subscribe({
      next: (priceHistory) => {
        this._priceHistory.set(priceHistory);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading price history:', error);
        this._priceHistory.set([]);
        this._loading.set(false);
      }
    });
  }

  setActiveTab(tab: 'inventory' | 'priceHistory'): void {
    this._activeTab.set(tab);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(product: Product): string {
    if (product.DiscontinuedDate) {
      return 'bg-danger';
    } else if (product.SellEndDate && new Date(product.SellEndDate) < new Date()) {
      return 'bg-warning';
    } else {
      return 'bg-success';
    }
  }

  getStatusText(product: Product): string {
    if (product.DiscontinuedDate) {
      return 'Discontinued';
    } else if (product.SellEndDate && new Date(product.SellEndDate) < new Date()) {
      return 'Ended';
    } else {
      return 'Active';
    }
  }

  // Method to get suggested products with data
  getSuggestedProducts(): number[] {
    // These are common product IDs that typically have inventory and price history data
    return [1, 2, 3, 4, 5, 316, 317, 318, 319, 320];
  }
}
