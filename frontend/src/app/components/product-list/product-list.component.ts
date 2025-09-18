import { Component, EventEmitter, Input, Output, signal, computed, OnChanges } from '@angular/core';
import { Product, ProductSearchResult, ProductSearchCriteria } from '../../models/product.model';

type SortDirection = 'asc' | 'desc' | '';
type SortableColumn = 'ProductID' | 'Name' | 'ProductNumber' | 'Color' | 'ListPrice' | 'Size' | 'Weight' | 'SellStartDate';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnChanges {
  // Private signals
  private _searchResult = signal<ProductSearchResult | null>(null);
  private _loading = signal<boolean>(false);
  private _sortColumn = signal<SortableColumn | ''>('');
  private _sortDirection = signal<SortDirection>('');
  private _page = signal<number>(1);
  private _pageSize = signal<number>(25);

  // Input setters
  @Input() set searchResult(value: ProductSearchResult | null) {
    this._searchResult.set(value);
  }
  @Input() set loading(value: boolean) {
    this._loading.set(value);
  }

  @Input() set page(value: number) {
    if (typeof value === 'number' && value > 0) {
      this._page.set(value);
    }
  }

  @Input() set pageSize(value: number) {
    if (typeof value === 'number' && value > 0) {
      this._pageSize.set(value);
    }
  }

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  // Readonly signals for template access
  readonly loadingSignal = this._loading.asReadonly();
  readonly searchResultSignal = this._searchResult.asReadonly();
  readonly pageSignal = this._page.asReadonly();
  readonly pageSizeSignal = this._pageSize.asReadonly();

  // Computed signals
  hasResults = computed(() => (this._searchResult()?.totalCount ?? 0) > 0);
  totalCount = computed(() => this._searchResult()?.totalCount || 0);
  totalPages = computed(() => {
    const provided = this._searchResult()?.totalPages;
    if (provided && provided > 0) return provided;
    const count = this.totalCount();
    const size = this._pageSize();
    return size > 0 ? Math.ceil(count / size) : 0;
  });
  
  // Sorted products
  products = computed(() => {
    const products = this._searchResult()?.products || [];
    const sortColumn = this._sortColumn();
    const sortDirection = this._sortDirection();
    
    if (!sortColumn || !sortDirection) {
      return products;
    }
    
    return [...products].sort((a, b) => {
      let aValue: any = a[sortColumn];
      let bValue: any = b[sortColumn];
      
      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      
      // Convert to strings for comparison if needed
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  });

  // Server-side pagination: products() already contains the current page

  onPageChange(page: number): void {
    this._page.set(page);
    this.pageChange.emit(page);
  }

  onPageSizeChange(size: number | string): void {
    const parsed = typeof size === 'string' ? parseInt(size, 10) : size;
    const valid = parsed && parsed > 0 ? parsed : 25;
    if (this._pageSize() !== valid) {
      this._pageSize.set(valid);
      // Reset to first page when page size changes
      this._page.set(1);
      this.pageSizeChange.emit(valid);
      this.pageChange.emit(1);
    }
  }

  onSort(column: SortableColumn | ''): void {
    const currentColumn = this._sortColumn();
    const currentDirection = this._sortDirection();
    
    if (currentColumn === column) {
      // Cycle through: asc -> desc -> '' -> asc
      if (currentDirection === 'asc') {
        this._sortDirection.set('desc');
      } else if (currentDirection === 'desc') {
        this._sortDirection.set('');
        this._sortColumn.set('');
      } else {
        this._sortDirection.set('asc');
      }
    } else {
      // New column, start with ascending
      this._sortColumn.set(column);
      this._sortDirection.set('asc');
    }
    
    // Emit sort change after updating the sort state
    const sortBy = this._sortColumn();
    const sortDir = this._sortDirection();
    if (sortBy && (sortDir === 'asc' || sortDir === 'desc')) {
      this.sortChange.emit({ sortBy: sortBy as ProductSearchCriteria['sortBy'], sortDir: sortDir as ProductSearchCriteria['sortDir'] });
    } else {
      this.sortChange.emit({ sortBy: undefined, sortDir: undefined });
    }
  }

  getSortIcon(column: SortableColumn | ''): string {
    const currentColumn = this._sortColumn();
    const currentDirection = this._sortDirection();
    
    if (currentColumn !== column) {
      return 'bi-arrow-down-up'; // Default sort icon
    }
    
    return currentDirection === 'asc' ? 'bi-arrow-up' : 
           currentDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-down-up';
  }

  @Output() sortChange = new EventEmitter<{ sortBy: ProductSearchCriteria['sortBy']; sortDir: ProductSearchCriteria['sortDir'] }>();

  ngOnChanges(): void {
    // Only emit sort changes when sort actually changes, not on every change detection
    // This prevents infinite loops
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusClass(product: Product): string {
    if (product.DiscontinuedDate) {
      return 'text-danger';
    }
    if (product.SellEndDate && new Date(product.SellEndDate) < new Date()) {
      return 'text-warning';
    }
    return 'text-success';
  }

  getStatusText(product: Product): string {
    if (product.DiscontinuedDate) {
      return 'Discontinued';
    }
    if (product.SellEndDate && new Date(product.SellEndDate) < new Date()) {
      return 'End of Life';
    }
    return 'Active';
  }
}
