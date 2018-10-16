class SElement {
    constructor(element, f, g, h) {
        this.element = [];
        this.element[0] = element[0];
        this.element[1] = element[1];
        this.f = f;
        this.g = g;
        this.h = h;
    }
}

class Set {

  constructor(){
    this.size = 0;
    this.storage = [];
  }

  add(element, f, g, h) {
    var sElement = new SElement(element, f, g, h);
    var contain = false;

    this.storage[this.size] = sElement;
    this.size++;

    for (var i = this.size - 1; i >= 0  && !contain; i--) {
      if(i - 1 >= 0 && this.storage[i - 1].f > sElement.f) {
        this.storage[i] = this.storage[i - 1];
        this.storage[i - 1] = sElement;
      }else{
        contain = true;
      }
    }

  }

  getMin(){
    if(this.size > 0){
      return this.storage[0];
    }else{
      return undefined;
    }
  }

  contains(cmp){
    var found = false;
    for(var i = 0; i < this.size  && !found; i++){
      if(this.storage[i].element[0] == cmp[0] && this.storage[i].element[1] == cmp[1]){
        found = true;
      }
    }
    return found;
  }

  getGScore(cmp){
    for(var i = 0; i < this.size; i++){
      if(this.storage[i].element[0] == cmp[0] && this.storage[i].element[1] == cmp[1]){
        return this.storage[i].g;
      }
    }
  }

  setScores(cmp, f, g, h){
    for(var i = 0; i < this.size; i++){
      if(this.storage[i].element[0] == cmp[0] && this.storage[i].element[1] == cmp[1]){
        this.storage[i].f = f;
        this.storage[i].g = g;
        this.storage[i].h = h;
      }
    }
  }

  deleteMin(){
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
