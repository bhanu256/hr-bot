import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataShareService } from '../data-share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  err = false;

  constructor(public http : HttpClient,public serve : DataShareService,public route : Router,public elementRef : ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = 'linear-gradient(#232526, #414345)';
 }

  auth(user : string, pass : string){
    var url = "https://backendbot.azurewebsites.net/api/login?user="+user+"&pass="+pass+"&b="+this.serve.batch;
    this.err = false;
    
    this.http.get(url).subscribe((data)=>{
      var cd = new Date()
      var ld = new Date(Object.values(data)[2])
      if(Object.values(data)[0]=="false"&&cd<=ld){
        this.serve.user = user
        this.serve.passw = pass
        this.serve.set_sub(Object.values(data)[1])
        this.route.navigate(['Home'])
      }
      else{
        this.serve.error = "User session was expired!!"
        this.route.navigate(["error"])
        console.log(data)
      }
    },
    (error)=>{
      console.log(error)
      this.err = true;
    })
  }

}
