import { Component, OnInit, ElementRef } from '@angular/core';
import { DataShareService } from '../data-share.service';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  videoGranted = false;
  audioGranted = false;

  name = ""

  constructor(public serve : DataShareService,public route : ActivatedRoute,public router : Router,public elementRef : ElementRef) { 

    this.name = this.serve.user;
    
    if(this.serve.user==""&&this.serve.passw==""){
      this.router.navigate(["login"])
    }

    serve.visited = true;

    navigator.getUserMedia({video:true},(suc)=>{
      this.videoGranted = true
    },
    (err)=>{
      this.videoGranted = false
      console.log(err)
    })
    navigator.getUserMedia({audio:true},(suc)=>{
      this.audioGranted = true
    },
    (err)=>{
      this.audioGranted = false
      console.log(err)
    })
  }

  ngOnInit() {
    console.log(this.serve.get_sub())
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = '';
 }

  nav(){
    if(this.videoGranted&&this.audioGranted){
      this.router.navigate(["Interview"])
    }
  }

}
