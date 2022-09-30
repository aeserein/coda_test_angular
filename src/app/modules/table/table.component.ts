import { MiaPagination, MiaQuery } from '@agencycoda/mia-core';
import { MiaFormConfig, MiaFormModalComponent, MiaFormModalConfig } from '@agencycoda/mia-form';
import { MiaColumn, MiaTableComponent, MiaTableConfig, MiaTableEditableComponent, MiaTableEditableConfig } from '@agencycoda/mia-table';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Client } from 'src/app/entities/client';
import { ClientService } from 'src/app/services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent, ConfirmModalText } from 'src/app/components/confirm-modal/confirm-modal.component';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

	@ViewChild('tableEditable') tableEditable!: MiaTableEditableComponent;
	@ViewChild('tableComp') tableComponent!: MiaTableComponent;

	tableConfig: MiaTableConfig = new MiaTableConfig();

	tableEditableConfig: MiaTableEditableConfig = new MiaTableEditableConfig();
	tableDataEditable: Array<any> = [];

	queryScroll = new MiaQuery();
	mfmConfig! : MiaFormModalConfig;

	constructor(public cs : ClientService,
				protected dialog : MatDialog,
				private eRef : ElementRef) {
	}

	ngOnInit(): void {
		this.loadConfig();
		this.formSetup();
		this.queryScroll.itemPerPage = 1;
	}

	onClickSave() {
		console.log("----------------------------------------------------------------------------------");
		console.log(this.tableEditable.getDataItems());
	}

	loadConfig() {
		this.tableConfig.service = this.cs;
		this.tableConfig.id = 'table-test';
		this.tableConfig.columns = [
			{ key: 'firstName', type: 'string', title: 'Nombre', field_key: 'firstname' },
			{ key: 'lastName', type: 'string', title: 'Apellido', field_key: 'lastname' },
			{ key: 'email', type: 'string', title: 'Correo', field_key: 'email' },
			{
				key: 'more', type: 'more', title: '', extra: {
					actions: [
						{ icon: 'create', title: 'Edit', key: 'edit' },
						{ icon: 'delete', title: 'Delete', key: 'delete' },
					]
				}
			},
		];

		let color = this.eRef.nativeElement.style.getProperty('--main');
		console.log(color);
		
		this.tableConfig.loadingColor = 'red';
		this.tableConfig.hasEmptyScreen = true;
		this.tableConfig.emptyScreenTitle = 'No ha ingresado ningún cliente';

		this.tableConfig.onClick.subscribe(result => {
			switch (result.key) {
				case "edit": {
					this.openForm(result.item);
					break;
				}
				case "delete": {
					this.deleteClient(result.item);
				}
			}
		});

	}

	formSetup() {
		this.mfmConfig = new MiaFormModalConfig();
		this.mfmConfig.titleNew = 'Crear cliente';
		this.mfmConfig.titleEdit = 'Editar cliente';
		this.mfmConfig.service = this.cs;

		let config = new MiaFormConfig();
		config.hasSubmit = false;
		config.fields = [
			{ key: 'firstname', type: 'string', label: 'Nombre' },
			{ key: 'lastname', type: 'string', label: 'Apellido' },
			{ key: 'email', type: 'string', label: 'Correo' },
		];
		config.errorMessages = [
			{ key: 'required', message: 'Campo "%label%" requerido' }
		];

		this.mfmConfig.config = config;
	}

	openForm(client : Client | null) {
		this.mfmConfig.item = client ? client : new Client();
		return this.dialog.open(MiaFormModalComponent, {
			width: '520px',
			panelClass: 'modal-full-width-mobile',
			data: this.mfmConfig
		}).afterClosed().subscribe((c) => {
			if (c) {
				this.cs.saveOb(c).subscribe(()=> {
					this.tableComponent.loadItems();
				});
			}
		});
	}

	deleteClient(client: Client): void {
		let cmt = new ConfirmModalText("¿Eliminar el cliente " + client.firstname + " " + client.lastname + "?", "Eliminar", "Cancelar")
		this.dialog.open(ConfirmModalComponent, {
			data: cmt
		}).afterClosed().subscribe(confirmation => {
			if (confirmation) {
				this.cs.deleteOb(this.cs.basePathUrl + "/remove/" + client.id).subscribe(()=> {
					this.tableComponent.loadItems();
				});
			}
		})
	}

}