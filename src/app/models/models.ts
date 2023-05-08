export interface Participant {
    id: number;
    nom: string;
    participantMiahoot: number;
}

export interface Concepteur {
    createdMiahoots: number[];
}

export interface Presentateur {
    createdMiahoots: number[];
}

export interface Response {
    id?: number;
    label?: string;
    estValide?: boolean;
    modifiable?:boolean;
}

export interface Question {
    id?: number;
    label: string;
    miahoot?: string;
    responses?: Response[];
}

export type VOTES = { 
    [participantUID: string]: boolean
  } | {};

export interface QCMProjected { 
    question: string; 
    responses: Response[]; // Les réponses possibles 
    votes: VOTES; // Autant d'entrée dans le tableau que de réponses possibles 
};


export interface MiahootProjected { 
    id: string; 
    pin? : number;
    label : string | undefined;
    creator?: string; 
    presentator?: string; 
    currentQCM: QCMProjected[]; 
} 

export interface Miahoot {
    id?: number;
    concepteur?: Concepteur;
    presentateur?: Presentateur;
    participants?: Participant[];
    nom?: string;
    questions?: Question[];
    miahootBirthday? : Date;
    status? : number;
}

export interface Teacher {
    id?: number;
    nom: string;
    createdMiahoots?: Miahoot[];
    presentedMiahoots?: Miahoot[];
    fireBaseId : String;
  }