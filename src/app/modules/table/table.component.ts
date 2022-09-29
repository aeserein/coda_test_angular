import { MiaPagination, MiaQuery } from '@agencycoda/mia-core';
import { MiaFormConfig, MiaFormModalComponent, MiaFormModalConfig } from '@agencycoda/mia-form';
import { MiaColumn, MiaTableComponent, MiaTableConfig, MiaTableEditableComponent, MiaTableEditableConfig } from '@agencycoda/mia-table';
import { Component, OnInit, ViewChild } from '@angular/core';
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


	constructor(public cs: ClientService,
				protected dialog: MatDialog) {
	}

	ngOnInit(): void {
		this.loadConfig();
		this.loadConfigEditable();

		this.queryScroll.itemPerPage = 1;
	}

	onClickSave() {
		console.log("----------------------------------------------------------------------------------");
		console.log(this.tableEditable.getDataItems());
	}

	loadConfigEditable() {
		/*
		this.tableDataEditable = [
			{ title: 'Titulo 1', status: 4 },
			{ title: 'Titulo 2', status: 4 },
			{ title: 'Titulo 3', status: 1 },
			{ title: 'Titulo 4', status: 4, date: '1989-08-25' },
			{ title: 'Titulo 5', status: 2 },
			{ title: 'Titulo 6', status: 4 },
		];

		this.tableEditableConfig.hasAdd = true;
		this.tableEditableConfig.columns = [
			{ key: 'title', type: MiaColumn.TYPE_INPUT_EDITABLE, field_key: 'title', title: 'Title' },
			{ key: 'date', type: MiaColumn.TYPE_DATE_EDITABLE, field_key: 'date', title: 'Date' },
			{
				key: 'status', type: MiaColumn.TYPE_SELECT_EDITABLE, title: 'Estado', field_key: 'status', extra: {
					options: [
						{ id: 0, title: 'Estado 1', color: 'warning' },
						{ id: 1, title: 'Estado 2', color: 'error' },
						{ id: 2, title: 'Estado 3', color: 'violet' },
						{ id: 3, title: 'Estado 4', color: 'success' },
						{ id: 4, title: 'Estado 5', color: 'blue' },
						{ id: 5, title: 'Estado 6', color: 'cyan' },
						{ id: 6, title: 'Estado 7', color: 'pink' },
						{ id: 7, title: 'Estado 8', color: '' },
					]
				}
			},
			{ key: 'vendor', type: MiaColumn.TYPE_SELECT_SERVICE_EDITABLE, field_key: 'vendor_id', title: 'Vendor', extra: { service: this.cs, field_display: 'title', query: new MiaQuery() } },
			{ key: 'remove', type: MiaColumn.TYPE_REMOVE_EDITABLE, title: '' },
		];

		this.tableEditableConfig.subject = new Subject<any>();
		this.tableEditableConfig.subject.subscribe(res => {

		});
		*/
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

		this.tableConfig.loadingColor = 'red';
		this.tableConfig.hasEmptyScreen = true;
		this.tableConfig.emptyScreenTitle = '---------------------------------ATENCIÓN-----------------------------------';

		this.tableConfig.onClick.subscribe(result => {
			switch (result.key) {
				case "edit": {
					this.onClickOpenForm(result.item);
					break;
				}
				case "delete": {
					this.deleteClient(result.item);
				}
			}
		});

	}

	onClickOpenForm(client: Client) {
		let data = new MiaFormModalConfig();
		data.item = client;
		data.titleNew = 'Settings';
		data.titleEdit = 'Settings';
		//data.showButtons = false;

		let config = new MiaFormConfig();
		config.hasSubmit = false;
		config.fields = [
			{ key: 'firstname', type: 'string', label: 'Nombre' },
			{ key: 'lastname', type: 'string', label: 'Apellido' },
			{ key: 'email', type: 'string', label: 'Correo' },
		];
		config.errorMessages = [
			{ key: 'required', message: 'Campo requerido  ------------ATENCION------- "%label%"' }
		];

		data.config = config;

		return this.dialog.open(MiaFormModalComponent, {
			width: '500px',
			panelClass: 'modal-full-width-mobile',
			data: data
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
