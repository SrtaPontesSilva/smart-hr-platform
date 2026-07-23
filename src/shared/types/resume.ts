// frontend/src/shared/types/resume.ts
export interface Resume {
    id: string;
    candidateName: string;
    age: number;
    submissionDate: string; // formato ISO
    vacancy: string;
    fileUrl: string;
    fileType: 'pdf' | 'doc';
  }
  