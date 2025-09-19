import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProductService } from './services/product.service';
import { Product, ProductSearchCriteria, ProductSearchResult } from './models/product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'AdventureWorks Products';
  
  // Signals for reactive state management
  private _searchResult = signal<ProductSearchResult | null>(null);
  private _loading = signal<boolean>(false);
  private _currentSearchCriteria = signal<ProductSearchCriteria>({});
  private _error = signal<string | null>(null);
  private _isSearchSectionCollapsed = signal<boolean>(true); // Default to collapsed
  private _page = signal<number>(1);
  private _pageSize = signal<number>(25);
  private _sortBy = signal<ProductSearchCriteria['sortBy'] | undefined>(undefined);
  private _sortDir = signal<ProductSearchCriteria['sortDir'] | undefined>(undefined);

  // Readonly signals for template access
  searchResult = this._searchResult.asReadonly();
  loading = this._loading.asReadonly();
  currentSearchCriteria = this._currentSearchCriteria.asReadonly();
  error = this._error.asReadonly();
  isSearchSectionCollapsed = this._isSearchSectionCollapsed.asReadonly();
  page = this._page.asReadonly();
  pageSize = this._pageSize.asReadonly();
  sortBy = this._sortBy.asReadonly();
  sortDir = this._sortDir.asReadonly();

  // Computed signals
  hasResults = computed(() => (this._searchResult()?.products.length ?? 0) > 0);
  totalProducts = computed(() => this._searchResult()?.totalCount || 0);
  isHomePage = computed(() => this._currentUrl() === '/');

  private _currentUrl = signal<string>('/');

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
    // Track route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this._currentUrl.set((event as NavigationEnd).url);
      });
  }

  loadProducts(criteria?: ProductSearchCriteria): void {
    this._loading.set(true);
    this._error.set(null);
    const mergedCriteria: ProductSearchCriteria = {
      ...(this._currentSearchCriteria() || {}),
      ...(criteria || {}),
      page: this._page(),
      limit: this._pageSize(),
      sortBy: this._sortBy(),
      sortDir: this._sortDir()
    };
    this._currentSearchCriteria.set(mergedCriteria);
    
    this.productService.getAllProducts(mergedCriteria).subscribe({
      next: (result) => {
        this._searchResult.set(result);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this._error.set('Failed to load products. Please try again.');
        this._loading.set(false);
      }
    });
  }

  onSearch(criteria: ProductSearchCriteria): void {
    // Reset pagination when a new search is performed
    this._page.set(1);
    
    // Store only the search criteria (without pagination/sorting)
    const searchOnlyCriteria: ProductSearchCriteria = {
      name: criteria.name,
      productNumber: criteria.productNumber,
      color: criteria.color,
      productLine: criteria.productLine,
      class: criteria.class,
      style: criteria.style,
      size: criteria.size
    };
    this._currentSearchCriteria.set(searchOnlyCriteria);
    
    this.loadProducts({ ...criteria, page: 1, limit: this._pageSize() });
  }

  onClearSearch(): void {
    this._page.set(1);
    this._currentSearchCriteria.set({});
    this.loadProducts({ page: 1, limit: this._pageSize() });
  }

  showSearchSection(): void {
    this._isSearchSectionCollapsed.set(false); // Show search section when button is clicked
  }

  onHideSearch(): void {
    this._isSearchSectionCollapsed.set(true);
  }

  onPageChange(page: number): void {
    this._page.set(page);
    this.loadProducts({ ...this._currentSearchCriteria(), page, limit: this._pageSize(), sortBy: this._sortBy(), sortDir: this._sortDir() });
  }

  onPageSizeChange(size: number): void {
    this._pageSize.set(size);
    // Reset to first page when page size changes
    this._page.set(1);
    this.loadProducts({ ...this._currentSearchCriteria(), page: 1, limit: size, sortBy: this._sortBy(), sortDir: this._sortDir() });
  }

  onSortChange(evt: { sortBy: ProductSearchCriteria['sortBy']; sortDir: ProductSearchCriteria['sortDir'] }): void {
    this._sortBy.set(evt.sortBy);
    this._sortDir.set(evt.sortDir);
    // Reset to first page on sort change
    this._page.set(1);
    this.loadProducts({ ...this._currentSearchCriteria(), page: 1, limit: this._pageSize(), sortBy: evt.sortBy, sortDir: evt.sortDir });
  }
}
