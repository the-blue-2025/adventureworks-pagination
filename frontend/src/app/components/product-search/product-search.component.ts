import { Component, EventEmitter, Input, Output, signal, computed, effect, OnChanges, SimpleChanges } from '@angular/core';
import { ProductSearchCriteria } from '../../models/product.model';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html'
})
export class ProductSearchComponent implements OnChanges {
  @Input() currentCriteria: ProductSearchCriteria = {};
  @Output() searchCriteria = new EventEmitter<ProductSearchCriteria>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() hideSearch = new EventEmitter<void>();

  // Individual field signals for maximum reactivity
  private _name = signal<string>('');
  private _productNumber = signal<string>('');
  private _color = signal<string>('');
  private _productLine = signal<string>('');
  private _class = signal<string>('');
  private _style = signal<string>('');
  private _size = signal<string>('');
  
  // State signals
  private _isSearching = signal<boolean>(false);
  private _isClearing = signal<boolean>(false);

  // Readonly signals for template access
  readonly name = this._name.asReadonly();
  readonly productNumber = this._productNumber.asReadonly();
  readonly color = this._color.asReadonly();
  readonly productLine = this._productLine.asReadonly();
  readonly class = this._class.asReadonly();
  readonly style = this._style.asReadonly();
  readonly size = this._size.asReadonly();
  readonly isSearching = this._isSearching.asReadonly();
  readonly isClearing = this._isClearing.asReadonly();

  // Computed signals for reactive state management
  readonly hasSearchCriteria = computed(() => {
    const fields = [
      this._name(),
      this._productNumber(),
      this._color(),
      this._productLine(),
      this._class(),
      this._style(),
      this._size()
    ];
    return fields.some(field => field && field.trim() !== '');
  });

  readonly activeFieldCount = computed(() => {
    const fields = [
      this._name(),
      this._productNumber(),
      this._color(),
      this._productLine(),
      this._class(),
      this._style(),
      this._size()
    ];
    return fields.filter(field => field && field.trim() !== '').length;
  });

  readonly isFormValid = computed(() => this.hasSearchCriteria());
  readonly totalSearchFields = computed(() => this.activeFieldCount());

  // Computed signal for current search criteria from form fields
  readonly formCriteria = computed((): ProductSearchCriteria => {
    const criteria: ProductSearchCriteria = {};
    
    if (this._name().trim()) criteria.name = this._name().trim();
    if (this._productNumber().trim()) criteria.productNumber = this._productNumber().trim();
    if (this._color().trim()) criteria.color = this._color().trim();
    if (this._productLine().trim()) criteria.productLine = this._productLine().trim();
    if (this._class().trim()) criteria.class = this._class().trim();
    if (this._style().trim()) criteria.style = this._style().trim();
    if (this._size().trim()) criteria.size = this._size().trim();
    
    return criteria;
  });

  // Computed signal for form validation state
  readonly formState = computed(() => ({
    isValid: this.hasSearchCriteria(),
    isEmpty: !this.hasSearchCriteria(),
    fieldCount: this.activeFieldCount(),
    isSearching: this._isSearching(),
    isClearing: this._isClearing()
  }));

  // Computed signal for individual field states
  readonly fieldStates = computed(() => ({
    name: { value: this._name(), hasValue: !!this._name().trim() },
    productNumber: { value: this._productNumber(), hasValue: !!this._productNumber().trim() },
    color: { value: this._color(), hasValue: !!this._color().trim() },
    productLine: { value: this._productLine(), hasValue: !!this._productLine().trim() },
    class: { value: this._class(), hasValue: !!this._class().trim() },
    style: { value: this._style(), hasValue: !!this._style().trim() },
    size: { value: this._size(), hasValue: !!this._size().trim() }
  }));

  constructor() {
    // Effect to automatically clear search criteria when all fields are empty
    effect(() => {
      if (!this.hasSearchCriteria() && !this._isClearing()) {
        // All fields are empty, no action needed
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentCriteria'] && this.currentCriteria) {
      this.populateFieldsFromCriteria(this.currentCriteria);
    }
  }

  private populateFieldsFromCriteria(criteria: ProductSearchCriteria): void {
    this._name.set(criteria.name || '');
    this._productNumber.set(criteria.productNumber || '');
    this._color.set(criteria.color || '');
    this._productLine.set(criteria.productLine || '');
    this._class.set(criteria.class || '');
    this._style.set(criteria.style || '');
    this._size.set(criteria.size || '');
  }

  // Field update methods with input validation
  updateName(value: string): void {
    this._name.set(value || '');
  }

  updateProductNumber(value: string): void {
    this._productNumber.set(value || '');
  }

  updateColor(value: string): void {
    this._color.set(value || '');
  }

  updateProductLine(value: string): void {
    this._productLine.set(value || '');
  }

  updateClass(value: string): void {
    this._class.set(value || '');
  }

  updateStyle(value: string): void {
    this._style.set(value || '');
  }

  updateSize(value: string): void {
    this._size.set(value || '');
  }

  // Batch update method for clearing all fields efficiently
  private clearAllFields(): void {
    this._name.set('');
    this._productNumber.set('');
    this._color.set('');
    this._productLine.set('');
    this._class.set('');
    this._style.set('');
    this._size.set('');
  }

  onSearch(): void {
    this._isSearching.set(true);
    
    // Use the computed formCriteria signal
    const criteria = this.formCriteria();
    this.searchCriteria.emit(criteria);
    
    // Reset searching state after a short delay
    setTimeout(() => this._isSearching.set(false), 500);
  }

  onClear(): void {
    this._isClearing.set(true);
    
    // Clear all field signals efficiently
    this.clearAllFields();
    
    this.clearSearch.emit();
    
    // Reset clearing state
    setTimeout(() => this._isClearing.set(false), 100);
  }

  onHideSearch(): void {
    this.hideSearch.emit();
  }
}
