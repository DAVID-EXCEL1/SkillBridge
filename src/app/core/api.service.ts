import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base';

/**
 * One place for every call to the new backend features (orders, reviews,
 * payments, chat, artisan services, dashboard stats). The Authorization
 * header is added automatically by auth.interceptor.ts, so callers here
 * don't need to touch headers at all.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // --- Categories / services ---
  getCategories(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/categories`);
  }

  getSubCategories(categoryId: number): Observable<any> {
    return this.http.post(`${API_BASE_URL}/subcategoriess`, { category_id: categoryId });
  }

  addSubCategories(categoryId: number, subcategories: string[]): Observable<any> {
    return this.http.post(`${API_BASE_URL}/subcategories`, { category_id: categoryId, subcategories });
  }

  getArtisansByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${API_BASE_URL}/artisans/by-category?category_id=${categoryId}`);
  }

  getTopArtisans(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/artisans/top`);
  }

  // --- Admin management ---
  getAdminArtisans(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/admin/artisans`);
  }

  getAdminCustomers(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/admin/customers`);
  }

  toggleArtisanStatus(artisanId: number): Observable<any> {
    return this.http.post(`${API_BASE_URL}/admin/artisans/toggle-status`, { artisan_id: artisanId });
  }

  toggleCustomerStatus(customerId: number): Observable<any> {
    return this.http.post(`${API_BASE_URL}/admin/customers/toggle-status`, { customer_id: customerId });
  }

  getAllReviews(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/reviews`);
  }

  getAdminTrend(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/stats/admin/trend`);
  }

  // --- Profile (customer) ---
  getCustomerProfile(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/auth/profile`);
  }

  updateCustomerProfile(payload: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/profile`, payload);
  }

  changeCustomerPassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/change-password`, { current_password: currentPassword, new_password: newPassword });
  }

  // --- Profile (artisan) ---
  getArtisanProfile(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/artisanAuth/profile`);
  }

  updateArtisanProfile(payload: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/artisanAuth/profile`, payload);
  }

  changeArtisanPassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/artisanAuth/change-password`, { current_password: currentPassword, new_password: newPassword });
  }

  // --- Password (admin) ---
  changeAdminPassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/adminAuth/change-password`, { current_password: currentPassword, new_password: newPassword });
  }

  // --- Favorites ---
  addFavorite(artisanId: number): Observable<any> {
    return this.http.post(`${API_BASE_URL}/favorites`, { artisan_id: artisanId });
  }

  removeFavorite(artisanId: number): Observable<any> {
    return this.http.post(`${API_BASE_URL}/favorites/remove`, { artisan_id: artisanId });
  }

  listFavorites(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/favorites`);
  }

  saveArtisanServices(categoryId: number, subCategoryIds: number[]): Observable<any> {
    return this.http.post(`${API_BASE_URL}/artisan/services`, {
      category_id: categoryId,
      sub_category_ids: subCategoryIds
    });
  }

  getMyServices(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/artisan/services`);
  }

  // --- Orders ---
  createOrder(payload: {
    artisan_id: number;
    category_id?: number;
    order_description: string;
    price?: number;
    currency?: string;
    notes?: string;
    scheduled_for?: string;
  }): Observable<any> {
    return this.http.post(`${API_BASE_URL}/orders`, payload);
  }

  listOrders(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/orders`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/orders/update-status`, { order_id: orderId, status });
  }

  // --- Reviews ---
  createReview(orderId: number, rating: number, comment: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/reviews`, { order_id: orderId, rating, comment });
  }

  getReviews(artisanId: number): Observable<any> {
    return this.http.get(`${API_BASE_URL}/reviews?artisan_id=${artisanId}`);
  }

  // --- Payments ---
  recordPayment(orderId: number, amount: number, method: string = 'manual'): Observable<any> {
    return this.http.post(`${API_BASE_URL}/payments`, { order_id: orderId, amount, method });
  }

  listPayments(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/payments`);
  }

  // --- Chat ---
  sendMessage(otherUserId: number, message: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/chat/send`, { other_user_id: otherUserId, message });
  }

  getConversation(otherUserId: number): Observable<any> {
    return this.http.get(`${API_BASE_URL}/chat/conversation?with=${otherUserId}`);
  }

  getInbox(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/chat/inbox`);
  }

  // --- Stats ---
  getCustomerStats(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/stats/customer`);
  }

  getArtisanStats(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/stats/artisan`);
  }

  getAdminStats(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/stats/admin`);
  }
}
