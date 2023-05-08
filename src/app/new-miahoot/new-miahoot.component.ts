import { Component, ElementRef,ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiahootService } from '../services/miahoot.service';
import { Miahoot } from '../models/models';

interface QuestionReponses {
  question: string;
  reponses: string[];
  estCorrecte: boolean[];
}

/* interface Miahoot {
  id: number;
  questrep: QuestionReponses[];
} */

@Component({
  selector: 'app-new-miahoot',
  templateUrl: './new-miahoot.component.html',
  styleUrls: ['./new-miahoot.component.scss'],
})
export class NewMiahootComponent implements OnInit {

  questRep: QuestionReponses[] = [];
  newQuestion = '';
  newReponses: string[] = [];
  newCorrect: boolean[] = [];
  editable = false;
  tempReponses: string[] | undefined [] = [];
  editingIndexrep: number[] = [];
  editingQuestionIndex: boolean[]=[];
  //cette variable est pour tester
  questionRep: QuestionReponses;
  miahoots : Miahoot;
  id = Number(this.route.snapshot.paramMap.get('id'));
  newResp : string;
  estValide : boolean;
  modifiable = false;
  updateValide : boolean;

  constructor(private elementRef: ElementRef, 
              private route: ActivatedRoute,
              private miService: MiahootService ) { }

  ngOnInit() {
    console.log(this.id+" initialized");
    this.miService.getMiahoot(this.id)
    .then(miahoot => {
      console.log(miahoot);
      this.miahoots = miahoot;
    })
    .catch(err => console.error(err));
  }

  onSubmit() {
    // Vérifier si la nouvelle question n'est pas vide (après avoir enlevé les espaces blancs)
    if (this.newQuestion.trim()) {
      this.questRep.push({
        question: this.newQuestion,
        reponses: this.newReponses.filter((reponse) => reponse.trim()), // filtre les réponses vides (après avoir enlevé les espaces blancs)
        estCorrecte: this.newCorrect
      });
      this.newQuestion = '';
      this.newReponses = [];
      this.newCorrect = [];
    }
  }

  saveRep(j: number, id : number | undefined) {
    let rep = document.querySelector<HTMLInputElement>(`#editRéponse-${j}`)?.value;       
    this.miService.updateReponse(id,{label:rep,estValide:this.updateValide,modifiable:false})
                  .then(() => { this.ngOnInit() }); 
  }

  supprimeQuest(id: number | undefined){
    this.miService.deleteQuestion(id).then(() => { this.ngOnInit() });
  }

  supprimeRep(id : number | undefined){
    this.miService.deleteReponse(id).then(() => { this.ngOnInit() });
  }
 
  ajouterQuestion(){
    this.miService.createQuestion(this.id,{label:this.newQuestion}).then(() => { this.ngOnInit() });
  }

  ajouterReponse(i: number,questId: number | undefined){
    let rep = document.querySelector<HTMLInputElement>(`#réponse-${i}`)?.value;
    if(rep != null){
      if (rep.trim()) {
        this.miService.createReponse(questId,{label:rep,estValide:this.estValide}).then(() => { this.ngOnInit() });
        document.querySelector<HTMLInputElement>(`#réponses-${i}`)!.value = '';
        this.newCorrect[i] = false;
      }
  }
  
}
}
