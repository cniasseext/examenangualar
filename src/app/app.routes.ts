import { Routes } from '@angular/router';
import { ActivityComponent } from './module/activity/activity';

export const routes: Routes = [

    {
path:'activity',
component: ActivityComponent 
},

{
path:'',
redirectTo:'activity',
pathMatch :'full'
}
];
