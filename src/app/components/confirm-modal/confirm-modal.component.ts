import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
	selector: 'app-confirm-modal',
	templateUrl: './confirm-modal.component.html',
	styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

	constructor(public dialogRef: MatDialogRef<ConfirmModalComponent>,
				@Inject(MAT_DIALOG_DATA) public data: ConfirmModalText) {
	}

}

export class ConfirmModalText {
	caption : string;
	confirmButton : string;
	cancelButton : string;

	constructor(caption:string, confirmButton:string, cancelButton:string) {
		this.caption = caption;
		this.confirmButton = confirmButton;
		this.cancelButton = cancelButton;
	}
}
