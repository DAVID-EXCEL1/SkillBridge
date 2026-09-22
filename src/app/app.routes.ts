import { Routes } from '@angular/router';
import { Signup } from './signup/signup';
import { Signin } from './signin/signin';
import { Dashboard } from './dashboard/dashboard';
import { Landing } from './landing/landing';
import { Admin } from './admin/admin';
import { Artisan } from './artisan/artisan';
import { ArtisanSignup } from './artisan-signup/artisan-signup';
import { ArtisanSignin } from './artisan-signin/artisan-signin';
import { authGuardGuard } from './auth-guard-guard';
import { Subcategories } from './subcategories/subcategories';
import { Services } from './services/services';
import { AdminSignin } from './admin-signin/admin-signin';
import { artisanAuthGuardGuard } from './artisan-auth-guard-guard';
import { adminauthguardGuard } from './adminauthguard-guard';
import { AddAdmin } from './add-admin/add-admin';
import { FindArtisans } from './find-artisans/find-artisans';
import { BookArtisan } from './book-artisan/book-artisan';
import { MyOrders } from './my-orders/my-orders';
import { ArtisanOrders } from './artisan-orders/artisan-orders';
import { Messages } from './messages/messages';
import { AdminPayments } from './admin-payments/admin-payments';
import { anyAuthGuard } from './any-auth-guard';
import { AdminArtisans } from './admin-artisans/admin-artisans';
import { AdminCustomers } from './admin-customers/admin-customers';
import { AdminOrders } from './admin-orders/admin-orders';
import { AdminReviews } from './admin-reviews/admin-reviews';
import { ArtisanReviews } from './artisan-reviews/artisan-reviews';
import { Settings } from './settings/settings';
import { CustomerProfile } from './customer-profile/customer-profile';
import { ArtisanProfile } from './artisan-profile/artisan-profile';
import { ArtisanSchedule } from './artisan-schedule/artisan-schedule';
import { ArtisanEarnings } from './artisan-earnings/artisan-earnings';
import { Favorites } from './favorites/favorites';
import { Notifications } from './notifications/notifications';
import { AdminAnalytics } from './admin-analytics/admin-analytics';

export const routes: Routes = [
    {
        path: 'signup',
        component: Signup
    },
    {
        path: 'signin',
        component: Signin
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuardGuard],
    },
    {
        path: '',
        component: Landing
    },
    {
        path: 'admin', canActivate: [adminauthguardGuard],
        children: [
            { path: '', component: Admin },
            { path: 'add-admin', component: AddAdmin },
            {
                path: 'subcategories',
                component: Subcategories
            },
            { path: 'payments', component: AdminPayments },
            { path: 'artisans', component: AdminArtisans },
            { path: 'customers', component: AdminCustomers },
            { path: 'orders', component: AdminOrders },
            { path: 'reviews', component: AdminReviews },
            { path: 'analytics', component: AdminAnalytics },
        ]
    },
    {
        path: 'artisan', canActivate: [artisanAuthGuardGuard],
        children: [
            { path: '', component: Artisan },
            { path: 'services', component: Services },
            { path: 'orders', component: ArtisanOrders },
            { path: 'reviews', component: ArtisanReviews },
            { path: 'profile', component: ArtisanProfile },
            { path: 'schedule', component: ArtisanSchedule },
            { path: 'earnings', component: ArtisanEarnings },
        ]
    },
    {
        path: 'artisan-signup',
        component: ArtisanSignup
    },
    {
        path: 'artisan-signin',
        component: ArtisanSignin
    },
    {
        path: 'admin-signin',
        component: AdminSignin
    },
    // Customer-facing booking/orders/messaging — shares authGuardGuard with /dashboard
    {
        path: 'find-artisans',
        component: FindArtisans,
        canActivate: [authGuardGuard],
    },
    {
        path: 'book-artisan/:artisanId',
        component: BookArtisan,
        canActivate: [authGuardGuard],
    },
    {
        path: 'my-orders',
        component: MyOrders,
        canActivate: [authGuardGuard],
    },
    {
        path: 'profile',
        component: CustomerProfile,
        canActivate: [authGuardGuard],
    },
    {
        path: 'favorites',
        component: Favorites,
        canActivate: [authGuardGuard],
    },
    // Messages, Settings, and Notifications are shared by both customer and
    // artisan roles — each reads its own role from the JWT, so either
    // guard works; we register them once with anyAuthGuard.
    {
        path: 'messages',
        component: Messages,
        canActivate: [anyAuthGuard],
    },
    {
        path: 'settings',
        component: Settings,
        canActivate: [anyAuthGuard],
    },
    {
        path: 'notifications',
        component: Notifications,
        canActivate: [anyAuthGuard],
    },
];
