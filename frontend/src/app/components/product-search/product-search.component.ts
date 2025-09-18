import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductSearchCriteria } from '../../models/product.model';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html'
})
export class ProductSearchComponent {
  @Output() searchCriteria = new EventEmitter<ProductSearchCriteria>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() hideSearch = new EventEmitter<void>();

  searchForm: FormGroup;
  
  // Signals for reactive state management
  private _isSearching = signal(false);
  isSearching = this._isSearching.asReadonly();
  
  private _hasSearchCriteria = signal(false);
  hasSearchCriteria = this._hasSearchCriteria.asReadonly();
  
  private _activeFieldCount = signal(0);
  activeFieldCount = this._activeFieldCount.asReadonly();

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      name: [''],
      productNumber: [''],
      color: [''],
      productLine: [''],
      class: [''],
      style: [''],
      size: ['']
    });

    // Watch for form changes to update hasSearchCriteria and field count signals
    this.searchForm.valueChanges.subscribe(value => {
      const activeFields = Object.values(value).filter(val => val && val.toString().trim() !== '');
      const hasValues = activeFields.length > 0;
      this._hasSearchCriteria.set(hasValues);
      this._activeFieldCount.set(activeFields.length);
    });
  }

  onSearch(): void {
    this._isSearching.set(true);
    
    // Get form values and filter out empty ones
    const formValue = this.searchForm.value;
    const criteria: ProductSearchCriteria = {};
    
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value && value.toString().trim() !== '') {
        (criteria as any)[key] = value.toString().trim();
      }
    });
    
    this.searchCriteria.emit(criteria);
    
    // Reset searching state after a short delay
    setTimeout(() => this._isSearching.set(false), 500);
  }

  onClear(): void {
    this.searchForm.reset();
    this._hasSearchCriteria.set(false);
    this._activeFieldCount.set(0);
    this.clearSearch.emit();
  }

  // Computed signal for form validity - reactive to form changes
  isFormValid = computed(() => {
    return this._hasSearchCriteria();
  });

  // Computed signal for counting active search fields
  totalSearchFields = computed(() => {
    return this.activeFieldCount();
  });

  onHideSearch(): void {
    this.hideSearch.emit();
  }
}
