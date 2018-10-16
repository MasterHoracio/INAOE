class Stack{
  constructor(){
    this.size = 0;
    this.storage = {};
  }
  //function push element
  push(element){
    this.storage[this.size] = element;
    this.size++;
  }
  //function pop element
  pop(){
    if(this.size != 0){
      this.size--;
      var removed = this.storage[this.size];
      delete this.storage[this.size];
      return removed;
    }else{
      return undefined;
    }
  }
  //function return the status of the stack
  isEmpty(){
    return this.size == 0;
  }
  //function that clears the stack
  clearAll(){
    while(this.size != 0){
      this.size--;
      delete this.storage[this.size];
    }
  }
}
