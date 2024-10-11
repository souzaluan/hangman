class Word {
  readonly value: string;

  constructor(value: string) {
    this.value = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
      .toUpperCase();
  }
}

export default Word;
