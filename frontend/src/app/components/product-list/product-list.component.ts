import { Component, EventEmitter, Input, Output, signal, computed, effect } from '@angular/core';
import { Product, ProductSearchResult, ProductSearchCriteria } from '../../models/product.model';

type SortDirection = 'asc' | 'desc' | '';
type SortableColumn = 'ProductID' | 'Name' | 'ProductNumber' | 'Color' | 'ListPrice' | 'Size' | 'Weight' | 'SellStartDate';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
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

  // Enhanced computed signals for comprehensive state management
  readonly hasResults = computed(() => (this._searchResult()?.totalCount ?? 0) > 0);
  readonly totalCount = computed(() => this._searchResult()?.totalCount || 0);
  readonly totalPages = computed(() => {
    const provided = this._searchResult()?.totalPages;
    if (provided && provided > 0) return provided;
    const count = this.totalCount();
    const size = this._pageSize();
    return size > 0 ? Math.ceil(count / size) : 0;
  });

  // Sort state computed signals
  readonly sortState = computed(() => ({
    column: this._sortColumn(),
    direction: this._sortDirection(),
    isActive: !!(this._sortColumn() && this._sortDirection()),
    canSort: this.hasResults()
  }));

  // Pagination state computed signals
  readonly paginationState = computed(() => ({
    currentPage: this._page(),
    pageSize: this._pageSize(),
    totalPages: this.totalPages(),
    totalCount: this.totalCount(),
    hasNextPage: this._page() < this.totalPages(),
    hasPreviousPage: this._page() > 1,
    startIndex: (this._page() - 1) * this._pageSize() + 1,
    endIndex: Math.min(this._page() * this._pageSize(), this.totalCount())
  }));

  // Loading and data state computed signals
  readonly dataState = computed(() => ({
    isLoading: this._loading(),
    hasData: this.hasResults(),
    isEmpty: !this._loading() && !this.hasResults(),
    productCount: this._searchResult()?.products?.length || 0
  }));
  
  // Sorted products with enhanced sorting logic
  readonly products = computed(() => {
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

  // Computed signal for sort icons
  readonly sortIcons = computed(() => {
    const currentColumn = this._sortColumn();
    const currentDirection = this._sortDirection();
    
    return {
      ProductID: this.getSortIconForColumn('ProductID', currentColumn, currentDirection),
      Name: this.getSortIconForColumn('Name', currentColumn, currentDirection),
      ProductNumber: this.getSortIconForColumn('ProductNumber', currentColumn, currentDirection),
      Color: this.getSortIconForColumn('Color', currentColumn, currentDirection),
      ListPrice: this.getSortIconForColumn('ListPrice', currentColumn, currentDirection),
      Size: this.getSortIconForColumn('Size', currentColumn, currentDirection),
      Weight: this.getSortIconForColumn('Weight', currentColumn, currentDirection),
      SellStartDate: this.getSortIconForColumn('SellStartDate', currentColumn, currentDirection)
    };
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
      this.sortChange.emit({ 
        sortBy: sortBy as ProductSearchCriteria['sortBy'], 
        sortDir: sortDir as ProductSearchCriteria['sortDir'] 
      });
    } else {
      this.sortChange.emit({ sortBy: undefined, sortDir: undefined });
    }
  }

  // Helper method for sort icons (used by computed signal)
  private getSortIconForColumn(column: SortableColumn, currentColumn: SortableColumn | '', currentDirection: SortDirection): string {
    if (currentColumn !== column) {
      return 'bi-arrow-down-up'; // Default sort icon
    }
    
    return currentDirection === 'asc' ? 'bi-arrow-up' : 
           currentDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-down-up';
  }

  // Helper method for sort icon classes with colors
  getSortIconClass(column: SortableColumn): string {
    const currentColumn = this._sortColumn();
    const currentDirection = this._sortDirection();
    
    if (currentColumn !== column) {
      return 'bi-arrow-down-up text-warning'; // Default sort icon
    }
    
    return currentDirection === 'asc' ? 'bi-arrow-up text-success' : 
           currentDirection === 'desc' ? 'bi-arrow-down text-danger' : 'bi-arrow-down-up text-warning';
  }


  // Method to check if a column is currently sorted (ng-bootstrap pattern)
  isSorted(column: SortableColumn): boolean {
    return this._sortColumn() === column;
  }

  // Method to get sort icon class (ng-bootstrap pattern)
  getSortIcon(column: SortableColumn): string {
    if (this.isSorted(column)) {
      return this._sortDirection() === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
    }
    return '';
  }

  // Method to get tooltip text for sort indicators
  getSortTooltip(column: SortableColumn): string {
    const currentColumn = this._sortColumn();
    const currentDirection = this._sortDirection();
    
    if (currentColumn !== column) {
      return `Click to sort by ${column}`;
    }
    
    switch (currentDirection) {
      case 'asc':
        return `Currently sorted by ${column} (Ascending) - Click to sort Descending`;
      case 'desc':
        return `Currently sorted by ${column} (Descending) - Click to clear sort`;
      default:
        return `Click to sort by ${column}`;
    }
  }

  @Output() sortChange = new EventEmitter<{ sortBy: ProductSearchCriteria['sortBy']; sortDir: ProductSearchCriteria['sortDir'] }>();

  constructor() {
    // No automatic effects needed - sort changes are emitted manually in onSort
  }

  // Computed signals for utility functions
  readonly currencyFormatter = computed(() => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  );

  readonly dateFormatter = computed(() => 
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  );

  // Utility methods for template
  formatCurrency(value: number): string {
    return this.currencyFormatter().format(value);
  }

  formatDate(dateString: string): string {
    return this.dateFormatter().format(new Date(dateString));
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

  // Computed signal for page size options
  readonly pageSizeOptions = computed(() => [25, 50, 100]);

  // Computed signal for pagination info
  readonly paginationInfo = computed(() => {
    const state = this.paginationState();
    return {
      showing: `${state.startIndex}-${state.endIndex}`,
      total: state.totalCount,
      page: `${state.currentPage} of ${state.totalPages}`
    };
  });
}
