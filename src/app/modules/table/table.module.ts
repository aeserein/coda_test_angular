import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableRoutingModule } from './table-routing.module';
import { TableComponent } from './table.component';
import { MiaCoreModule } from '@agencycoda/mia-core';
import { MiaAuthModule } from '@agencycoda/mia-auth';
import { MiaTableModule } from '@agencycoda/mia-table';
import { MiaLoadingModule } from '@agencycoda/mia-loading';
import { MiaFormModule } from '@agencycoda/mia-form';
import { MiaAuthInterceptor, MIA_AUTH_PROVIDER } from '@agencycoda/mia-auth';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MIA_GOOGLE_STORAGE_PROVIDER } from '@agencycoda/mia-core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'; 

@NgModule({
	declarations: [
		TableComponent
	],
	imports: [
		CommonModule,
		TableRoutingModule,
		MiaCoreModule,
		MiaAuthModule,
		MiaTableModule,
		MiaLoadingModule,
		MiaFormModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule
	],
	providers: [
		{
			provide: MIA_AUTH_PROVIDER,
			useValue: {
				baseUrl: environment.baseUrl
			}
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: MiaAuthInterceptor,
			multi: true
		},
		{
			provide: MIA_GOOGLE_STORAGE_PROVIDER,
			useValue: {
				bucket: environment.cloudStorageBucket
			}
		}
	]
})
export class TableModule { }
