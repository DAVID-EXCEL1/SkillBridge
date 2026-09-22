import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Sidebar } from '../sidebar/sidebar';
import { getCurrentUser } from '../core/current-user';

/**
 * Shared inbox + conversation view for both customers and artisans — the
 * component reads its own role from the JWT rather than needing two
 * near-identical copies.
 *
 * This polls every 4s rather than using websockets: no extra server
 * process needed, works on any shared PHP host. Fine for v1; swap for
 * a websocket/SSE push later if real-time matters more.
 */
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  myRole = getCurrentUser()?.role;
  conversations: any[] = [];
  activeOtherUserId: number | null = null;
  messages: any[] = [];
  draft = '';
  private pollHandle: any;

  ngOnInit(): void {
    this.loadInbox();

    const withParam = this.route.snapshot.queryParamMap.get('with');
    if (withParam) {
      this.open(Number(withParam));
    }

    this.pollHandle = setInterval(() => {
      this.loadInbox();
      if (this.activeOtherUserId) {
        this.loadConversation(this.activeOtherUserId, false);
      }
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.pollHandle) clearInterval(this.pollHandle);
  }

  loadInbox() {
    this.api.getInbox().subscribe((response: any) => {
      this.conversations = response.conversations ?? [];
    });
  }

  open(otherUserId: number) {
    this.activeOtherUserId = otherUserId;
    this.loadConversation(otherUserId, true);
  }

  private loadConversation(otherUserId: number, resetDraft: boolean) {
    this.api.getConversation(otherUserId).subscribe((response: any) => {
      this.messages = response.messages ?? [];
      if (resetDraft) this.draft = '';
    });
  }

  send() {
    if (!this.activeOtherUserId || !this.draft.trim()) return;
    this.api.sendMessage(this.activeOtherUserId, this.draft).subscribe(() => {
      this.draft = '';
      this.loadConversation(this.activeOtherUserId!, false);
      this.loadInbox();
    });
  }

  isMine(message: any): boolean {
    return message.sender_role === this.myRole;
  }
}
