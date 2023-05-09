import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { DocumentData, DocumentSnapshot, collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { MiahootProjected, QCMProjected, Response } from '../models/models';
import { BehaviorSubject, Observable, Subscription, from, isEmpty, map, of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss'],
})
export class ParticipantComponent implements OnInit {

  pin = this.route.snapshot.paramMap.get('pin') ?? '';
  miahootProjected: any;
  miahoot$: Observable<MiahootProjected | null> | undefined;
  miahoot: MiahootProjected | undefined | null;
  indexQuestion = 0;
  private subscription: Subscription | undefined;
  idMiahoot: string;

  constructor(private route: ActivatedRoute, private fs: Firestore, private db: AngularFireDatabase) { }

  async ngOnInit(): Promise<void> {
    this.pin = this.route.snapshot.paramMap.get('pin') ?? '';
    const miahoot = await this.getMiahootByCodePin(this.pin);
    const miahootProjectedCollectionRef = collection(this.fs, 'miahootProjected');
    const docRef = doc(miahootProjectedCollectionRef, miahoot.id);

    this.miahoot$ = new Observable<DocumentSnapshot>((observer) => {
      const unsubscribe = onSnapshot(docRef,
        (docSnapshot) => {
          observer.next(docSnapshot);
        },
        (error) => {
          observer.error(error);
        }
      );
      return unsubscribe;
    }).pipe(
      map((docSnapshot) => {
        if (docSnapshot.exists()) {
          return { id: docSnapshot.id, ...docSnapshot.data() } as MiahootProjected;
        } else {
          return null;
        }
      })
    );
  }

  test() {
    this.miahoot$?.subscribe(
      (miahoot) => {
        console.log(miahoot);
        this.miahoot = miahoot;
        this.indexQuestion = miahoot?.indexQuestion ?? -1;
      },
      (error) => console.error(error)
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async getMiahootByCodePin(codePin: string): Promise<MiahootProjected> {
    const miahootProjectedCollectionRef = collection(this.fs, 'miahootProjected');
    const req = query(miahootProjectedCollectionRef, where('pin', '==', parseInt(codePin, 10)));
    const snap = await getDocs(req);

    if (snap.empty) {
      throw new Error(`No miahoot projected found with pin ${codePin}`);
    }

    const doc = snap.docs[0];
    const data = doc.data() as DocumentData;
    this.idMiahoot = data['id'];

    return {
      id: doc.id,
      label: data['label'],
      currentQCM: data['currentQCM'],
      indexQuestion: data['indexQuestion'],
      pin: data['pin'],
      presentator: data['presentator'],
    };
  }

}