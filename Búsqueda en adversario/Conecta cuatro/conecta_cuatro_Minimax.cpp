/*
  Instituto Nacional de Astrofísica, Óptica y Electrónica
  Author: Horacio Jesús Jarquín Vásquez
  Materia: inteligencia Artificial
*/

#include <bits/stdc++.h>

using namespace std;

const int MAS_INFINITO = INT_MAX;
const int MENOS_INFINITO = INT_MIN;

int moves[8][2] = {{1,0},{1,1},{0,1},{-1,1},
                  {-1,0},{-1,-1},{0,-1},{1,-1}};

int maxfunction(char [6][7], int [], int);
int minfunction(char [6][7], int [], int);

int tiromaquina = 0, nodos_generados = 0;

void printBoard(char board[6][7]){
  for(int i = 0; i < 6; i++){
    for(int j = 0; j < 7; j++){
      cout << board[i][j] << " ";
    }cout << endl;
  }
}

void printGanador(int gana){
  if(gana == 0){
    cout << "Empate" << endl;
  }else if(gana == 1){
    cout << "Jugador x gana" << endl;
  }else if(gana == 2){
    cout << "Jugador o gana" << endl;
  }
}

int countMoves(char board[6][7], char element, int i, int j){
  int count = 0, rows, cols;
  bool possible, win;
  for(int k = 0; k < 8; k++){
    win = possible = true;
    for(int l = 1; l < 4 && possible; l++){
      rows = moves[k][0] * l;
      cols = moves[k][1] * l;
      if(((i + rows) >= 0 && (i + rows) < 6) && ((j + (cols)) >= 0 && (j + (cols)) < 7)){
        if(board[i + rows][j + cols] != '-' && board[i + rows][j + cols] != element){
          win = possible = false;
        }else if(board[i + rows][j + cols] == '-'){
          win = false;
        }
      }else{
        win = possible = false;
      }
    }
    if(possible){++count;}
    if(win && element == 'x'){return MENOS_INFINITO;}
    if(win && element == 'o'){return MAS_INFINITO;}
  }
  return count;
}

int evalFunction(char board[6][7], char element){
  int sum = 0, n_moves;
  for(int i = 0; i < 6; i++){
    for(int j = 0; j < 7; j++){
      if(board[i][j] == element){
        n_moves = countMoves(board, element, i, j);
        if(n_moves == MAS_INFINITO || n_moves == MENOS_INFINITO){
          return n_moves;
        }
        sum += n_moves;
      }
    }
  }
  return sum;
}

int quienGana(char board[6][7]){
  bool empate = true;
  int count = 0;
  for(int i = 0; i < 6; i++){
    for(int j = 0; j < 7; j++){
      if(board[i][j] == 'x' || board[i][j] == 'o'){
        count = countMoves(board, board[i][j], i, j);
        if(count == MENOS_INFINITO)
          return 1;
        else if(count == MAS_INFINITO)
          return 2;
      }else{
        empate = false;
      }
    }
  }
  if(empate == true){return 0;}
  return 3;
}

void tiroTablero(char board[6][7], int posix[], int i, int j, char element){
  board[i][j] = element;
  posix[j]--;
  printBoard(board);
}

int minfunction(char board[6][7], int posix[], int nivel){//juega x
  int local_min = MAS_INFINITO, v, endgame;
  endgame = quienGana(board);
  if(nivel == 0 || endgame != 3){
    if(endgame != 3){
      if(endgame == 1){return MENOS_INFINITO;}
      if(endgame == 2){return MAS_INFINITO;}
    }
    return evalFunction(board, 'o') - evalFunction(board, 'x');
  }
  for(int i = 0; i < 7; i++){
    if(posix[i] >= 0){
      board[posix[i]][i] = 'x';
      posix[i]--;
      ++nodos_generados;
      v = maxfunction(board, posix, nivel - 1);
      if(v < local_min){
        local_min = v;
      }
      posix[i]++;
      board[posix[i]][i] = '-';
    }
  }
  return local_min;
}

int maxfunction(char board[6][7], int posix[], int nivel){//juega o
  int local_max = MENOS_INFINITO, v, endgame;
  endgame = quienGana(board);
  if(nivel == 0 || endgame != 3){
    if(endgame != 3){
      if(endgame == 1){return MENOS_INFINITO;}
      if(endgame == 2){return MAS_INFINITO;}
    }
    return evalFunction(board, 'o') - evalFunction(board, 'x');
  }
  for(int i = 0; i < 7; i++){
    if(posix[i] >= 0){
      board[posix[i]][i] = 'o';
      posix[i]--;
      ++nodos_generados;
      v = minfunction(board, posix, nivel - 1);
      if(v > local_max){
        local_max = v;
        tiromaquina = i;
      }
      posix[i]++;
      board[posix[i]][i] = '-';
    }
  }
  return local_max;
}

int main(){
  int posix[7], tiro, gana;
  char board[6][7];

  memset(board, '-', sizeof(board));
  for(int i = 0; i < 7; i++){posix[i] = 5;}
  cout << endl << "Conecta cuatro con Algoritmo MiniMax" << endl << endl;
  printBoard(board);

  do{
    cout << endl << "Ingrese la columna para tirar [0-6]: ";
    cin >> tiro;
    tiroTablero(board, posix, posix[tiro], tiro, 'x');
    gana = quienGana(board);
    if(gana != 3){
        printGanador(gana);
        break;
    }
    nodos_generados = 0;
    tiro = maxfunction(board, posix, 6);
    cout << "tiro maquina columna: " << tiromaquina << endl;
    cout << "Numero de nodos generados: " << nodos_generados << endl;
    tiroTablero(board, posix, posix[tiromaquina], tiromaquina, 'o');
    gana = quienGana(board);
    if(gana != 3){
        printGanador(gana);
        break;
    }

  }while(true);

  return 0;
}
