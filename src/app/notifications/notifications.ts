import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';
import { getCurrentUser } from '../core/current-user';

/**
 * There's no stored notifications table/read-state yet — this computes a
 * feed on the fly from data that already exists (recent order status
 * changes + unread conversations), rather than build a full notifications
 * system with its own persistence. Good enough for "what's new", not a
 * substitute for real push notifications.
 */
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  private api = inject(ApiService);

  myRole = getCurrentUser()?.role;
  items: any[] = [];
  loading = true;

  ngOnInit(): void {
    const orderItems: any[] = [];
    const messageItems: any[] = [];
    let pending = 2;

    const finish = () => {
      pending--;
      if (pending === 0) {
        this.items = [...orderItems, ...messageItems].sort(
          (a, b) => new Date(b.when).getTime() - new Date(a.when).getTime()
        );
        this.loading = false;
      }
    };

    this.api.listOrders().subscribe({
      next: (response: any) => {
        const orders = response.orders ?? [];
        for (const o of orders) {
          if (this.myRole === 'artisan' && o.status === 'pending') {
            orderItems.push({
              icon: 'bi-inbox',
              text: `New job request: ${o.order_description}`,
              when: o.created_on,
              link: '/artisan/orders'
            });
          } else if (this.myRole === 'customer' && ['accepted', 'declined', 'completed'].includes(o.status)) {
            orderItems.push({
              icon: o.status === 'completed' ? 'bi-check-circle' : o.status === 'declined' ? 'bi-x-circle' : 'bi-briefcase',
              text: `Your booking "${o.order_description}" was marked ${o.status}`,
              when: o.updated_on || o.created_on,
              link: '/my-orders'
            });
          }
        }
        finish();
      },
      error: () => finish()
    });

    this.api.getInbox().subscribe({
      next: (response: any) => {
        const conversations = response.conversations ?? [];
        for (const c of conversations) {
          if (c.unread_count > 0) {
            messageItems.push({
              icon: 'bi-chat-dots',
              text: `${c.unread_count} unread message${c.unread_count === 1 ? '' : 's'} from ${c.first_name} ${c.last_name}`,
              when: c.last_message_on,
              link: '/messages',
              queryParams: { with: c.other_user_id }
            });
          }
        }
        finish();
      },
      error: () => finish()
    });
  }
}
