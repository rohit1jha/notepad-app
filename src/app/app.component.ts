import { Observable, Subscription } from 'rxjs';
import { initialNotes } from './notes.fixture';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { NotesService } from './notes.service';
import { NewNote, Note } from './note';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms'




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  selected?: Note | NewNote;
  notesList: Note[];
  noteForm:FormGroup
  noteId:number;
  showForm:boolean=false;

  constructor(private readonly notesService: NotesService,private formBuilder: FormBuilder) { }
  public serviceSubscription: Subscription;

  ngOnInit() {
    this.noteForm = new FormGroup({
      title: new FormControl('',[Validators.required,Validators.minLength(5)]),
      body: new FormControl('',[Validators.required]),
      favorite: new FormControl(false),
      color: new FormControl('#000000')
    })
     this.serviceSubscription = this.notesService.notes$.subscribe(notes => {
      this.notesList = notes;
     });

  }
  selectNote(note) {
    this.noteId=note.id;
    this.showForm=true;
    this.noteForm.setValue({
      title:note.title,
      body:note.body,
      favorite:note.favorite,
      color:note.color
    })
    // const index = this.notesList.findIndex(currentNote => currentNote.id === note.id);
    // return this.selected = this.notesList[index];

  }

  newNote() {
    this.noteId=null;
    this.showForm=true;
    this.noteForm.setValue(createNewNote());
    this.selected = createNewNote();
  }

  // saveNote(note: Note) {
  saveNote() {
    let updatedNote: Note;
    updatedNote = { ...this.noteForm.value, id:this.noteId };
    this.notesService.saveNote(updatedNote).subscribe(newData => {
    this.noteId=newData.id;
    });
  }
  ngOnDestroy() {
    this.serviceSubscription.unsubscribe();
  }
}

function createNewNote(): NewNote {
  return { title: '', body: '', color: '', favorite: false };
}
