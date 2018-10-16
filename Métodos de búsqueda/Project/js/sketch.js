function make2DArray(rows, cols){
  var array = new Array(cols);
  for(var i = 0; i < array.length; i++){
    array[i] = new Array(rows);
  }
  return array;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePoint(cols, rows){
  var point = new Array(2);
  point[0] = getRandomInteger(0, cols - 1);
  point[1] = getRandomInteger(0, rows - 1);
  return point;
}

var board, visited, inner_board, parentMatrix;
var priorityQueue = new PriorityQueue();
var stack = new Stack();
var openSet = new Set();
var closedSet = new Set();
var initialState = [];
var finalState = [];
var rows = 10;
var cols = 10;
var w = 40;

function setup(){
  createCanvas(401,401);
  board = make2DArray(rows, cols);
  inner_board = make2DArray(rows, cols);
  visited = make2DArray(rows, cols);
  parentMatrix = make2DArray(rows, cols);
  initialState = generatePoint(cols, rows);
  finalState = generatePoint(cols, rows);
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      inner_board[i][j] = (random(1) < 0.15) ? 0 : 1;
      if(i == initialState[0] && j == initialState[1] ){
        inner_board[i][j] = 2;
      }else if(i == finalState[0] && j == finalState[1] ){
        inner_board[i][j] = 3;
      }
      board[i][j] = new Cell(i*w, j*w, w, inner_board[i][j], null);
    }
  }

}

function draw(){
  background(0);
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      board[i][j].show();
    }
  }
}

function clearVisited(){
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      parentMatrix[i][j] = null;
      visited[i][j] = false;
    }
  }
}

function clearBoard(){
  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      board[i][j].node = null;
      if(inner_board[i][j] == 1){
        board[i][j].passable = 1;
      }
    }
  }
}

function selectSearch(){
  var selector = document.getElementById('custom_select');
  var opt = selector[selector.selectedIndex].value;
  if(opt == "profundidad_primero"){
    profundidadPrimero();
  }else if(opt == "primero_mejor"){
    primeroElMejor();
  }else if(opt == "a_estrella"){
    a_estrella();
  }
}

function manhattanDistance(x1, y1, x2, y2){
  return abs(x1 - x2) + abs(y1 - y2);
}

function freeSquare(col, row){
  return (inner_board[col][row] == 1 || inner_board[col][row] == 3);
}

function buildPath(){
  var current = new Array(2);
  var path = new Stack();
  var nodes = 1;
  current = finalState;
  while(current != null){
    path.push(current);
    current = parentMatrix[current[0]][current[1]];
  }
  while(!path.isEmpty()){
    current = path.pop();
    board[current[0]][current[1]].node = nodes++;
    if(inner_board[current[0]][current[1]] == 1){
      board[current[0]][current[1]].passable = 4;
    }
  }
}

function computeNeighbors(col, row){
  var list = [];
  if(col - 1 >= 0 && !visited[col - 1][row] && freeSquare(col - 1, row)){//left
    list.push([col - 1, row]);
  }
  if(row + 1 < rows && !visited[col][row + 1] && freeSquare(col, row + 1)){//down
    list.push([col, row + 1]);
  }
  if(col + 1 < cols && !visited[col + 1][row] && freeSquare(col + 1, row)){//right
    list.push([col + 1, row]);
  }
  if(row - 1 >= 0 && !visited[col][row - 1] && freeSquare(col, row - 1)){//up
    list.push([col, row - 1]);
  }
  return list;
}

function a_estrella(){
  closedSet.clearAll(); openSet.clearAll(); clearVisited(); clearBoard();
  var g = 0, h = manhattanDistance(initialState[0], initialState[1], finalState[0], finalState[1]), f = g + h;
  openSet.add(initialState, f, g, h);
  var find = false;
  var current = new Array(2);
  while(!openSet.isEmpty() && !find){
    var object = openSet.deleteMin();
    closedSet.add(object.element, object.f, object.g, object.h);
    current = object.element;
    if(inner_board[current[0]][current[1]] == 3){ find = true; }
    neighbors = computeNeighbors(current[0], current[1]);
    for(i = 0; i < neighbors.length; i++){//for each neighbor
      if(!closedSet.contains(neighbors[i])){
        g = object.g + 1;
        if(!openSet.contains(neighbors[i])){
          openSet.add(neighbors[i], f, g, h);
        }else if(g >= openSet.getGScore(neighbors[i])){
          continue;
        }
        h = manhattanDistance(neighbors[i][0], neighbors[i][1], finalState[0], finalState[1]);
        f = g + h;
        openSet.setScores(neighbors[i], f, g, h);
        parentMatrix[neighbors[i][0]][neighbors[i][1]] = [current[0], current[1]];
      }
    }
  }
  if(find == false){ console.log("No se encontró solución"); }
  if(find == true){ buildPath(); }
}

function primeroElMejor(){
  priorityQueue.clearAll(); clearVisited(); clearBoard();
  var current = new Array(2);
  var prior = manhattanDistance(initialState[0], initialState[1], finalState[0], finalState[1]);
  var find = false; var nodes = 1;
  priorityQueue.enqueue(initialState, prior);

  while(!priorityQueue.isEmpty() && !find){
    current = priorityQueue.dequeue().element;
    if(!visited[current[0]][current[1]]){
      visited[current[0]][current[1]] = true;
      board[current[0]][current[1]].node = nodes++;
      if(inner_board[current[0]][current[1]] == 1){
        board[current[0]][current[1]].passable = 4;
      }
      if(inner_board[current[0]][current[1]] == 3){ find = true; }
      neighbors = computeNeighbors(current[0], current[1]);
      for(i = 0; i < neighbors.length; i++){//for each neighbor
        prior = manhattanDistance(neighbors[i][0], neighbors[i][1], finalState[0], finalState[1]);
        var aux = new Array(2);
        aux[0] = neighbors[i][0];
        aux[1] = neighbors[i][1];
        priorityQueue.enqueue(aux, prior);
      }
    }
  }
  if(find == false){ console.log("No se encontró solución"); }
}

function profundidadPrimero(){
  stack.clearAll(); clearVisited(); clearBoard();
  var current = new Array(2);
  var find = false; var nodes = 1;
  stack.push(initialState);
  while(!stack.isEmpty() && !find){
    current = stack.pop();
    if(!visited[current[0]][current[1]]){
      visited[current[0]][current[1]] = true;
      board[current[0]][current[1]].node = nodes++;
      if(inner_board[current[0]][current[1]] == 1){
        board[current[0]][current[1]].passable = 4;
      }
      if(inner_board[current[0]][current[1]] == 3){ find = true; }
      neighbors = computeNeighbors(current[0], current[1]);
      for(i = 0; i < neighbors.length; i++){//for each neighbor
        aux = new Array(2);
        aux[0] = neighbors[i][0];
        aux[1] = neighbors[i][1];
        stack.push(aux);
      }
    }
  }
  if(find == false){ console.log("No se encontró solución"); }
}
