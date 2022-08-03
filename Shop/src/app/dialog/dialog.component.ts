import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  productConditionList = ["New", "Used", "Refurbished"];
  productForm!: FormGroup;
  actionBtn: string = 'Save';
  productFormTitle: string = 'Add New Product';
  constructor(private formBuilder: FormBuilder, private api: ApiService, private dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public editData: any) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
    })
    if (this.editData) {
      this.actionBtn = 'Update';
      this.productFormTitle = 'Update Product Info';
      this.productForm.controls['name'].setValue(this.editData.name);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['condition'].setValue(this.editData.condition);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
    };
  }

  addOrUpdateProduct() {
    // if (this.productForm.valid)
      if (!this.editData)
        this.addProduct();
      else
        this.updateProduct();
    
  }

  addProduct() {
    this.api.postProduct(this.productForm.value).subscribe({
      next: (res) => {
        alert("Great! You added the product successfully!");
        this.productForm.reset();
        this.dialogRef.close('save');
      },
      error: () => {
        alert("Oops! Couldn't add the product, please try again!");
      }
    });
  }

  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
      next:(res)=>{
        alert("Great! You updated the product successfully!");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert("Oops! Couldn't update the product info, please try again!");
      }
    });
  }

}
