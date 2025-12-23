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
import { SubCategory } from './sub-category/sub-category';
import { Subcategories } from './subcategories/subcategories';
import { Services } from './services/services';
import { AdminSignin } from './admin-signin/admin-signin';
import { artisanAuthGuardGuard } from './artisan-auth-guard-guard';
import { adminauthguardGuard } from './adminauthguard-guard';
import { AddAdmin } from './add-admin/add-admin';
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
        ]
    },
    {
        path: 'artisan', canActivate: [artisanAuthGuardGuard],
        children: [
            { path: '', component: Artisan },
            { path: 'services', component: Services }
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
        path: 'sub-category',
        component: SubCategory
    },

    {
        path: 'admin-signin',
        component: AdminSignin
    },
];
