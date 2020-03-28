import { Component, OnInit, ViewChild, ElementRef,NgZone,ViewEncapsulation } from '@angular/core';
import { DataShareService } from '../data-share.service';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { WebcamModule, WebcamImage } from 'ngx-webcam';
import { Subject, Observable, queueScheduler } from 'rxjs';
import Speech from 'speak-tts';
import {
  SpeechRecognitionLang,
  SpeechRecognitionMaxAlternatives,
  SpeechRecognitionGrammars,
  SpeechRecognitionService,
} from '@kamiazya/ngx-speech-recognition';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
//import { AngularFireDatabase} from '@angular/fire/database';
import 'firebase/storage';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SpeechRecognitionLang,
      useValue: 'en-US',
    },
    {
      provide: SpeechRecognitionMaxAlternatives,
      useValue: 1,
    },
    SpeechRecognitionService,
  ],
})
export class InterviewComponent implements OnInit {

  @ViewChild('qhtml',{static:false}) qhtml : ElementRef;

  private trigger : Subject<void> = new Subject<void>();

  public webcamImage : WebcamImage = null;
  url : any;
  public speech : Speech

  public mirror = "never";

  ans = ""
  questions : Array<any>;
  answers : Array<any>;
  numof : number;

  facevalues = 0;
  textvalues = 0;

  constructor(public ngZone : NgZone,public serve : DataShareService,public route : Router,public storage : AngularFireStorage,public http : HttpClient,public ear: SpeechRecognitionService) { 

    this.speech = new Speech()

    if(!serve.visited){
      route.navigate(["login"]);
    }

    if(this.speech.hasBrowserSupport()){

      this.speech.init({
        'volume' : 1,
        'lang' : 'en-GB',
        'rate' : 1,
        'pitch' : 1,
        'voice' : 'Google UK English Female',
        'splitSentences' : true,
        'listeners' : {
          'onvoiceschanged' : (voices) => {
            console.log("changed",voices)
          }
        }
      })
    }
    else{
      this.serve.error = "Current system does not support speech. Please login in another system."
      route.navigate(["error"])
    }


  }

  ngOnInit() {

    var interval = setInterval(() => {
      if(this.serve.onqr){
        this.questions = this.serve.questions;
        this.answers = this.serve.answers;
        this.numof = this.questions.length;
        clearInterval(interval)
      }
    }, 500)

    setTimeout(() =>{
      this.hello()
    }, 3000)
  }

  hello(){
    var txt = "Hello, how are you today ?";
    var i =0;
    this.speech.speak({
      text : txt,
      queue : false,
      listeners : {
        onstart : () =>{
          this.qhtml.nativeElement.innerHTML = ""
          setInterval(()=>{
            if(i<txt.length){
              this.qhtml.nativeElement.innerHTML += txt.charAt(i)
              i = i+1;
            }
          },50)
        },
        onend : ()=>{
        
          this.helloListen()
        }
      }
    })
  }

  // sett(tx:string){
  //   if(i<tx.length){
  //     this.qhtml.nativeElement.innerHTML += tx.charAt(i)
  //     i = i+1;
  //     setTimeout(this.sett,50)
  //   }
  // }

  helloListen(){
    var got = false;
    this.ear.start()
    this.ear.onspeechend = (e) =>{
      console.log(e)
    }
    this.ear.onresult = (e) => {
      got = true;
    };
    this.ear.onend = (e) =>{
      this.ear.stop()
      if(!got){
        this.hellodint()
      }
      else{
        this.starting()
        this.triggerSnapShot()
      }
    }
  }

  hellodint(){
    var txt = "Hey, Am I audible?";
    var i = 0;
    this.speech.speak({
      text : txt,
      queue : false,
      listeners : {
        onstart : () =>{
          this.qhtml.nativeElement.innerHTML = ""
          setInterval(()=>{
            if(i<txt.length){
              this.qhtml.nativeElement.innerHTML += txt.charAt(i)
              i = i+1;
            }
          },50)
        },
        onend : ()=>{
          
          this.helloend()
        }
      }
    })
  }

  helloend(){
    var got = false;
    this.ear.start()
    this.ear.onspeechend = (e) =>{
      console.log(e)
    }
    this.ear.onresult = (e) => {
      got = true;
    };
    this.ear.onend = (e) =>{
      if(!got){
        console.log("logout")
        this.serve.error = "Voice is not reachable. Please try again."
        this.ngZone.run(()=>this.route.navigate(["error"]))
      }
      else{
        this.starting()
        this.triggerSnapShot()
      }
    }
  }

  starting(){
    var txt = "Shall we start the interview?";
    var i = 0;
    this.qhtml.nativeElement.innerHTML = ""
    this.speech.speak({
      text : txt,
      queue : false,
      listeners : {
        onstart : () =>{
          setInterval(()=>{
            if(i<txt.length){
              this.qhtml.nativeElement.innerHTML += txt.charAt(i)
              i = i+1;
            }
          },50)
        },
        onend : ()=>{
          
          this.ear.start()
          this.ear.onend = (e) =>{
            this.questioning(0)
          }
        }
      }
    })
  }

  questioning(no:number){
    console.log(this.questions[no])
    if(no<this.numof)
    this.talk(this.questions[no],no)
    else
    setTimeout(()=>{
      this.talk("Thank you, Have a nice day",this.numof)
    },500)
  }

   async talk(text : String,no:number){
     var i = 0;
    if(no<this.numof){
      this.qhtml.nativeElement.innerHTML = ""
      this.speech.speak({
        text : text,
        queue : false,
        listeners : {
          onstart : () =>{
            setInterval(()=>{
              if(i<text.length){
                this.qhtml.nativeElement.innerHTML += text.charAt(i)
                i = i+1;
              }
            },50)
          },
          onend : ()=>{
            this.listen(no)
          }
        }
      })
    }
    else{
      this.qhtml.nativeElement.innerHTML = ""
      this.speech.speak({
        text : text,
        queue : false,
        listeners : {
          onstart : () =>{
            setInterval(()=>{
              if(i<text.length){
                this.qhtml.nativeElement.innerHTML += text.charAt(i)
                i = i+1;
              }
            },50)
          },
          onend : ()=>{
            console.log("Bye")
            console.log(this.facevalues)
            console.log(this.textvalues)
            this.serve.submit(this.facevalues,this.textvalues)
            this.serve.error = "Your interview is completed. We will inform you if you have been shortlisted. Thank you."
            this.ngZone.run(()=>this.route.navigate(["error"]))
          }
        }
      })
    }
  }

  listen(no:number){
    var got = false;
    var mes = "";
    this.ear.start()
    this.ear.onspeechstart = (e) => {
      this.triggerSnapShot()
    }
    this.ear.onspeechend = (e) => {
      console.log('onspeechend', e);
    }
    this.ear.onresult = (e) => {
      got = true;
      mes = e.results[0].item(0).transcript;
    };
    this.ear.onend = (e) => {
      if(no+1<this.numof){
        var txt = "Let's move to other question";
      }
      else{
        var txt = "Fine!"
      }
      var i =0;
      if(!got){
        this.speech.speak({
          text : txt,
          queue : false,
          listeners : {
            onstart : () =>{
              this.qhtml.nativeElement.innerHTML = ""
              setInterval(()=>{
                if(i<txt.length){
                  this.qhtml.nativeElement.innerHTML += txt.charAt(i)
                  i = i+1;
                }
              },50)
            },
            onend : ()=>{
              setTimeout(()=>{
                this.questioning(no+1)
                //this.qhtml.nativeElement.innerHTML = ""
              },1000)
            }
          }
        })
      }
      else{
        
        console.log(this.answers[no])
        console.log(mes)
        this.txtProc(mes,no)
        setTimeout(()=>{
          this.questioning(no+1)
          //this.qhtml.nativeElement.innerHTML = ""
        },1000)
      }
    }
  }

  public triggerSnapShot() : void{
    this.trigger.next();
  }

  public handleImage(webcamImage : WebcamImage) : void {
    this.webcamImage = webcamImage;
    console.log("wor",webcamImage);
    this.upload()
  }

  public get triggerObservable() : Observable<void>{
    return this.trigger.asObservable();
  }

  public upload(){
    this.storage.ref("A.jpeg").putString(this.webcamImage.imageAsDataUrl,"data_url").then((task)=>{
      task.ref.getDownloadURL().then(url=>{
        console.log(url)
        this.imgProc(url)
      })
    })
  }

  public imgProc(url:any){
    this.serve.url_service(url).subscribe((data)=>{
      console.log(data)
      var fac = data[0].faceAttributes.emotion
      var score = fac.neutral+fac.happiness+fac.surprise-fac.anger-fac.contempt-fac.disgust-fac.fear-fac.sadness;
      console.log(score)
      this.facevalues += score;
    },
    (error)=>{
      console.log(error);
    })
  }

  public txtProc(text : string,no:number){

    console.log(text,no)

    var oans = this.answers[no].toLowerCase().match(/\b(\w+)\b/g)
    console.log(oans)
    var uans = text.toLowerCase().match(/\b(\w+)\b/g)
    console.log(uans)

    var score = 0;

    uans.forEach(txt=>{
      if(oans.includes(txt)){
        score += 5
      }
    })

    score = score/oans.length

    this.textvalues += score;


    // this.serve.text_service(text).subscribe((data)=>{
      
    //   console.log(Object.values(data)[0][0].keyPhrases)
    //   console.log()
    // },
    // (error)=>{
    //   console.log(error)
    // })
  }

}
