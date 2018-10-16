function Cell(x, y, w, wall, n_node){
  this.passable = wall;
  this.node = n_node;
  this.x = x;
  this.y = y;
  this.w = w;
}

Cell.prototype.show = function () {
  stroke(0);
  if(this.passable == 1){
    fill(255);
  }else if(this.passable == 0){
    fill(0);
  }else if(this.passable == 2){
    fill(28,175,87);
  }else if(this.passable == 3){
    fill(28,121,175);
  }else if(this.passable == 4){
    fill(175,28,97);
  }
  rect(this.x, this.y, this.w, this.w);
  if(this.node != null){
    fill(0);
    textAlign(CENTER);
    text(this.node, this.x+(this.w*0.5), this.y+(this.w*0.6));
  }
};
