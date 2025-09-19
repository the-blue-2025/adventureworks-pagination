import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductSearchCriteria, ProductSearchResult, ProductInventory, ProductListPriceHistory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(criteria?: ProductSearchCriteria): Observable<ProductSearchResult> {
    let params = new HttpParams();
    
    if (criteria) {
      Object.keys(criteria).forEach(key => {
        const value = criteria[key as keyof ProductSearchCriteria];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ProductSearchResult>(this.apiUrl, { params });
  }

  searchProducts(criteria: ProductSearchCriteria): Observable<ProductSearchResult> {
    let params = new HttpParams();
    
    Object.keys(criteria).forEach(key => {
      const value = criteria[key as keyof ProductSearchCriteria];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ProductSearchResult>(`${this.apiUrl}/search`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductInventory(productId: number): Observable<ProductInventory[]> {
    return this.http.get<ProductInventory[]>(`${this.apiUrl}/${productId}/inventory`);
  }

  getProductPriceHistory(productId: number): Observable<ProductListPriceHistory[]> {
    return this.http.get<ProductListPriceHistory[]>(`${this.apiUrl}/${productId}/price-history`);
  }
}
