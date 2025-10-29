import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // registers all imports
  templateUrl: './app.html',
  styleUrl: './app.css'
})


// This takes in what we want to create
export class App implements OnInit{
  ngOnInit(): void {
    // this.outputStudent();

    this.newStudents = this.students.splice(0,3)
  }

  protected readonly title = signal('my-first-angular-app');

  student: String = 'Anthonia'
  num: Number = 7
  students: Array<any> = ["Anthonia", "David", 7, "Anthonia", "David", 7]
  newStudents:Array<any> = []

  outputStudent = () => {
    console.log("I am a student")
  }
}



// The first part of your ts file is usually the imports
// The next thing is more of like your head tag in an html file

// Ts helps to maintain data integrity