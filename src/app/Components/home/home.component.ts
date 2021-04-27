import { Component, OnInit } from '@angular/core';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedApp = {name:"",desc:""};
  constructor() { }
  
  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.from('.name-card', {
      scrollTrigger: '.name-card',
      y: -100,
      opacity: 0,
      ease: " none",
      duration: 2
    });
  }
  
  ExplainContent(number){
    switch(number) {
      case 0:
        this.selectedApp = {name:'Adobe Photoshop',desc:'Adobe Photoshop is a raster graphics editor developed and published by Adobe Inc. The software has become the industry standard not only in raster graphics editing, but in digital art as a whole.'};break;
      case 1:
        this.selectedApp = {name:'Windows 10/7',desc:'In this situation, I am referring to the fact that i am very well accustomed to all things related to the Windows 10 and 7 OS.'};break;
      case 2:
        this.selectedApp = {name:'C-Sharp',desc:"C-Sharp or 'C#' is a Programming language commonly used for Front-end applications which makes use of Graphical elements. It's easy-to-use makes the design of Apps much easier and its powerful archive of downloadable libraries makes it a must for Application developers"};break;
      case 3:
        this.selectedApp = {name:'HTML 5',desc:'HTML is the standard markup language for documents designed to be displayed in a web browser.'};break;
      case 4:
        this.selectedApp = {name:'Bootstrap',desc:'Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS- and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components.'};break;
      case 5:
        this.selectedApp = {name:'Material UI',desc:'Material Design is a design language that Google developed in 2014. Expanding on the "card" motifs that debuted in Google Now, Material Design uses more grid-based layouts, responsive animations and transitions, padding, and depth effects such as lighting and shadows.'};break;
      case 6:
        this.selectedApp = {name:'CSS3',desc:'Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML.'};break;
      case 7:
        this.selectedApp = {name:'Javascript',desc:'JavaScript, often abbreviated as JS, is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm. It has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.'};break;
      case 8:
        this.selectedApp = {name:'GSAP Animations',desc:'The GreenSock Animation Platform (GSAP) is a popular set of JavaScript tools for building animations on the web.'};break;
      case 9:
        this.selectedApp = {name:'PHP',desc:'PHP is a general-purpose scripting language especially suited to web development and server-side communication.'};break;
      case 10:
        this.selectedApp = {name:'Github',desc:'GitHub, Inc. is a provider of Internet hosting for software development and version control using Git. It offers the distributed version control and source code management functionality of Git, plus its own features.'};break;
      case 11:
        this.selectedApp = {name:'SQL',desc:'SQL is a domain-specific language used in programming and designed for managing data held in a relational database management system, or for stream processing in a relational data stream management system.'};break;
      case 12:
          this.selectedApp = {name:'PostgreSQL',desc:'ostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance. It was originally named POSTGRES, referring to its origins as a successor to the Ingres database developed at the University of California, Berkeley.'};break;
      case 13:
        this.selectedApp = {name:'Microsoft Office Apps',desc:'Microsoft Office, or simply Office, is a family of client software, server software, and services developed by Microsoft.'};break;
      case 14:
        this.selectedApp = {name:'Google Apps',desc:'Google Workspace is a collection of cloud computing, productivity and collaboration tools, software and products developed and marketed by Google.'};break;
      case 15:
        this.selectedApp = {name:'Angular',desc:'Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations.'};break;
      case 16:
        this.selectedApp = {name:'Typescript',desc:'TypeScript is a programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing to the language.'};break;
      case 17:
        this.selectedApp = {name:'Firebase',desc:'Firebase is a platform developed by Google for creating mobile and web applications.'};break;
      case 18:
        this.selectedApp = {name:'Node.js',desc:'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.'};break;
      case 19:
        this.selectedApp = {name:'Java',desc:'Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.'};break;
      case 20:
        this.selectedApp = {name:'Shotcut',desc:'Shotcut is a free and open-source cross-platform video editing application for FreeBSD, Linux, macOS and Windows.'};break;
      case 21:
        this.selectedApp = {name:'Amazon AWS',desc:'Amazon.com, Inc. is an American multinational technology company based in Seattle, Washington, which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.'};break;
      default:
        
    } 
  }

}

