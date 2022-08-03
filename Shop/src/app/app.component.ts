import { Component, OnInit,ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Shop';
  displayedColumns: string[] = ['name', 'category', 'date', 'condition','price','comment','action'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

constructor(private dialog: MatDialog, private api:ApiService){}

  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save')
      this.getAllProducts();
    });   
}

getAllProducts(){
  this.api.getAllProduct().subscribe({
    next:(res)=>{
this.dataSource=new MatTableDataSource(res);
this.dataSource.paginator= this.paginator;
this.dataSource.sort=this.sort;
    },
    error:()=>{
      alert("Oops! Couldn't fetch products");
    }
  })
}

editProduct(row:any){
  this.dialog.open(DialogComponent,{width:'30%',data:row}).afterClosed().subscribe(val=>{
    if(val==='update')
    this.getAllProducts();
  });
}

deleteProduct(id:number){
  this.api.deleteProduct(id).subscribe({
    next:(res)=>{
      alert("Cool! You deleted the product successfully!");
      this.getAllProducts();
    },
    error: () => {
      alert("Oops! Couldn't delete the product info, please try again!");
    }
  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

}
