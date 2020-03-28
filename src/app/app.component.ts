import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

import Speech from 'speak-tts';
import { DataShareService } from './data-share.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project';

  speech : any;

  batch = ""

  constructor(public route : ActivatedRoute,public router : Router, public serve : DataShareService){
    this.speech = new Speech()

    if(this.speech.hasBrowserSupport()){
      console.log("has s")

      this.speech.init({
        'volume' : 1,
        'lang' : 'en-GB',
        'rate' : 1,
        'pitch' : 1,
        'voice' : 'Google UK English Male',
        'splitSentences' : true,
        'listeners' : {
          'onvoiceschanged' : (voices) => {
            console.log("changed",voices)
          }
        }
      })
    }
  }

  ngOnInit(){
    let params = new URLSearchParams(window.location.search)
    if(params.has("b")){
      this.batch = params.get("b")

      this.serve.batch = this.batch;

      // this.serve.set_sub(this.subjects);

      this.router.navigate(["login"])
    }
    else{
      this.serve.error = "Invalid url"
      this.router.navigate(["error"])
    }
    
  }

  talk(){
    this.speech.speak({
      text : "Hello, Fuck off!!!!",
    }).then(()=>{
      console.log("suc")
    }).catch(e => {
      console.error("dsss")
    })
  }
}
