class QElement {
    constructor(element, priority) {
        this.element = {};
        this.priority = priority;
        this.element[0] = element[0];
        this.element[1] = element[1];
    }
}

class PriorityQueue {

  constructor(){
    this.size = 0;
    this.storage = [];
  }

  enqueue(element, priority) {
    var qElement = new QElement(element, priority);
    var contain = false;

    this.storage[this.size] = qElement;
    this.size++;

    for (var i = this.size - 1; i >= 0  && !contain; i--) {
      if(i - 1 >= 0 && this.storage[i - 1].priority > qElement.priority) {
        this.storage[i] = this.storage[i - 1];
        this.storage[i - 1] = qElement;
      }else{
        contain = true;
      }
    }

  }

  //function dequeue element
  dequeue(){
    if(this.size > 0){
      this.size--;
      var removed = this.storage[0];
      this.storage.shift();
      return removed;
    }else{
      return undefined;
    }
  }

  //function return the status of the stack
  isEmpty(){
    return this.size == 0;
  }

  clearAll(){
    while(this.size != 0){
      this.size--;
      this.storage.shift();
    }
  }

}
