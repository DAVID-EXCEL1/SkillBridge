import { Routes } from '@angular/router';
import { Signup } from './signup/signup';
import { Signin } from './signin/signin';
import { Dashboard } from './dashboard/dashboard';
import { Landing } from './landing/landing';
import { Admin } from './admin/admin';
import { Artisan } from './artisan/artisan';
import { ArtisanSignup } from './artisan-signup/artisan-signup';
import { ArtisanSignin } from './artisan-signin/artisan-signin';
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
        component: Dashboard
    },
    {
        path: '',
        component: Landing
    },
    {
        path: 'admin',
        component: Admin
    },
    {
        path: 'artisan',
        component: Artisan
    },
    {
        path: 'artisan-signup',
        component: ArtisanSignup
    },
    {
        path: 'artisan-signin',
        component: ArtisanSignin
    }
];
