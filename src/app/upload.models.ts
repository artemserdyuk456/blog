export class  Upload {
  key: string;
  url: string;
  name: string;
  progress: number;
  file: File;

  createOn: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}
