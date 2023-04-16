// реализуем 2 состояния: Draft and Publish


// item
class DocumentItem {
  // контент статьи
  public text: string;
  // текущее состояние
  private state: DocumentItemState;

  constructor() {
    this.setState(new DraftDocumentItemState());
  }

  getState() {
    return this.state;
  }

  setState(state: DocumentItemState) {
    this.state = state;
    this.state.setContext(this);
  }

  publishDoc() {
    this.state.publish()
  }

  deleteDoc() {
    this.state.delete();
  }

}

// state - родит-й класс
abstract class DocumentItemState {
  public name: string;
  public item: DocumentItem;

  // текущий
  public setContext(item: DocumentItem) {
    this.item = item;
  }

  public abstract publish(): void;
  public abstract delete(): void;
}

// состояние - черновик
class DraftDocumentItemState extends DocumentItemState {
  constructor() {
    super();
    this.name = 'DraftDocument'
  }

  publish(): void {
    console.log('from draft to publish', this.item.text);
    this.item.setState(new PublishDocumentItemState());
  }

  delete(): void {
    console.log('delete');
  }
}

// состояние опубликован
class PublishDocumentItemState extends DocumentItemState {
  constructor() {
    super();
    this.name = 'PublishDocument'
  }

  publish(): void {
    console.log('Document already published');
  }

  delete(): void {
    console.log('from publish to  draft');
    this.item.setState(new DraftDocumentItemState());
  }
}

// Usage
const item = new DocumentItem();
item.text = 'My post';
console.log(item.getState());
item.publishDoc();
item.publishDoc();
console.log(item.getState());
item.deleteDoc();
console.log(item.getState());
