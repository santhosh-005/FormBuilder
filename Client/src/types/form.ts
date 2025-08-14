export interface CategorizeItem {
  id: string;
  text: string;
  correctCategory?: string;
}

export interface CategorizeQuestion {
  type: 'categorize';
  categories: string[];
  items: CategorizeItem[];
  imageUrl?: string;
}

export interface ClozeBlank {
  id: string;
  answerHint?: string;
}

export interface ClozeQuestion {
  type: 'cloze';
  text: string;
  blanks: ClozeBlank[];
  imageUrl?: string;
  options?: string[]; // Draggable answer options
}

export interface ComprehensionOption {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
}

export interface ComprehensionQuestion {
  type: 'comprehension';
  passage: string;
  questions: ComprehensionOption[];
  imageUrl?: string;
}

export type Question = CategorizeQuestion | ClozeQuestion | ComprehensionQuestion;

export interface Form {
  _id: string;
  title: string;
  description?: string; // Made optional
  headerImageUrl: string | null;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormData {
  title: string;
  description?: string; // Made optional
  headerImageUrl?: string | null;
  questions: Question[];
}

export interface CategorizeAnswer {
  [itemId: string]: string;
}

export interface ClozeAnswer {
  [blankId: string]: string;
}

export interface Answer {
  questionId: string;
  answer: CategorizeAnswer | ClozeAnswer[] | number;
}

export interface SubmissionData {
  userId?: string;
  answers: Answer[];
}

export interface Submission {
  _id: string;
  formId: string;
  userId?: string;
  answers: Answer[];
  createdAt: string;
}
