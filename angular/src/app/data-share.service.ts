import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {

  visited = false;

  subjects = "";

  questions : Array<any>;
  answers : Array<any>;

  onqr = false;

  batch = ""
  user = ""
  passw = ""

  error = ""

  constructor(public http : HttpClient) { 
    //this.get_questions()
  }

  set_sub(subjects : String){
    this.subjects = subjects.toLowerCase()

    this.get_questions()
  }

  get_sub(){
    return this.subjects
  }

  url_service(url:string){
    console.log("img got")
    var base = "https://emotion-detector-video.cognitiveservices.azure.com/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=emotion";
    const head = new HttpHeaders({
      "Content-Type":"application/json",
      "Ocp-Apim-Subscription-Key":"23ae6153ee184ada9f541128275a0cef"
    });
    var options = ({
      headers : head
    });

    return this.http.post(base,{url : url},{headers : head});
  }

  get_questions(){
    var header = new HttpHeaders();
    header.append('Content-Type', 'application/json');

    this.http.post("https://backendbot.azurewebsites.net/api/GetQuestions?q="+this.subjects,{name:"hhh"},{headers : header})
      .subscribe((data)=>{
        console.log(data)
        this.onqr = true;
        this.questions = Object.keys(data)
        this.answers = Object.values(data)
      },
      (error)=>{
        console.log(error)
      })
  }

  text_service(text : string){
    var base = "https://analyzer-based-skills.cognitiveservices.azure.com/text/analytics/v3.0-preview.1/keyPhrases";
    const head = new HttpHeaders({
      "Content-Type":"application/json",
      "Ocp-Apim-Subscription-Key":"ba3d475f6f5a41228139d7080ed4b478"
    });
    var options = ({
      headers : head
    });

    var doc =  {
      'documents': [
          { 'id': '1', 'text': text },
      ]
  };

    return this.http.post(base,doc,{headers : head});
  }

  submit(fv:number,tv:number){
    var score = (fv*5/6)+tv
    score = (score/15)*100
    var url = "https://backendbot.azurewebsites.net/api/CompCand?n="+this.user+"&p="+this.passw+"&b="+this.batch+"&s="+score;
    this.http.get(url).subscribe((data)=>{
      console.log(data)
    },
    (error)=>{
      console.log(error)
    })
  }

  
}
