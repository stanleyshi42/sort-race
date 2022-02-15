// Stanley Shi; 10/15/2020

var g_canvas = {cell_size:20, wid:66, hgt:40}; // Grid size info
var g_frame_cnt = 0; // Setup a P5 display-frame counter for animation
var g_frame_mod = 60; // Update every 'mod' frames; 60 frames is around 1 sec
var g_stop = 0;
var g_race_cnt = 0; // Count of races completed
var g_sample_input = ["05CA627BC2B6F03", "286E1D0342D7859",
                      "065DE6671F040BA", "30E530C4786AF21",
                      "0684FB893D5754E", "328DE4765C10BA9",
                      "07C9A2D183E4B65", "34F2756F18E90BA",
                      "1FAB3D47905C286", "D7859286E2D0342", "9876543210ABECE"]
var g_random_input = g_sample_input[Math.floor(Math.random() * g_sample_input.length)]; //Choose a random input 
//g_random_input = g_sample_input[1]; //Hard code input for testing purposes
var g_input = [];
for(let i = 0; i < g_random_input.length; i++){ //Stores our input in an array
  g_input[i] = g_random_input.charAt(i);
}

//Data for each sort; .slice() passes the array by value
var g_insertion = {input:g_input.slice(), i:1, j:0, sorted:false}; //i and j are iterators
var g_poresort = {input:g_input.slice(), pass:0, sorted:false}; //pass counts number of passes performed
var g_mergesort = {input:g_input.slice(), pass:0, sorted:false};
var g_quicksort = {input:g_input.slice(), pass:0, sorted:false};

//Perform setup for the algorithm race
//Draws a grid and setups up mergesort
function setup(){ //P5 Setup Function
  let sz = g_canvas.cell_size;
  let width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1 pixels.
  let height = sz * g_canvas.hgt;
  createCanvas(width, height);  // Make a P5 canvas.
  draw_grid(g_canvas.cell_size, 0, 'white', 'red');

  //Draw initial text
  drawString("INSERTION SORT", 0, 0);
  drawString("GOLD'S PORESORT", 17, 0);
  drawString("MERGE SORT", 34, 0);
  drawString("QUICK SORT", 51, 0);
  drawArray(g_input, 0, 1)
  drawArray(g_input, 17, 1)
  drawArray(g_input, 34, 1)
  drawArray(g_input, 51, 1)

  //Split up input into 1-element arrays for the mergesort
  mergeSortSetup(g_mergesort.input);
  quickSortSetup(g_quicksort.input);
}

//Draws a string starting at the given x,y cell of the grid
function drawString(str, x, y){
  textSize(18);
  textAlign(CENTER, CENTER);
  fill('white');
  let sz = g_canvas.cell_size;
  let center = (sz / 2) + 1; //The center pixel of a cell
  for (let i = 0; i < str.length; i++){
    text(str.charAt(i), center + (sz * i) + (x * sz), center + (sz * y));
  }
}

//Draws an array's contents starting at the given x,y cell of the grid
function drawArray(arr, x, y){
  textSize(18);
  textAlign(CENTER, CENTER);
  fill('white');
  let sz = g_canvas.cell_size;
  let center = (sz / 2) + 1; //The center pixel of a cell
  for (let i = 0; i < arr.length; i++){
    text(arr[i], center + (sz * i) + (x * sz), center + (sz * y));
  }
}

//Shifts an array 1 to the right
function shiftArrayRight(arr){
  result = [arr.pop()];
  for(let i = 0; i < arr.length; i++){
    result [i + 1] = arr[i];
  }
  return result;
}

//Checks if an array is sorted
function isSorted(arr){
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1])
        return false;
  }
  return true;
}

//Performs setup for quicksort
//Puts our intial input in an array of sub-arrays
function quickSortSetup(arr){
   g_quicksort.input.push(arr);
}

//Performs setup for the mergesort
//Partitions input into multiple 1-element arrays
function mergeSortSetup(arr){
  let result = [];
  for(let i = 0; i < arr.length; i++){
    result[i] = [arr[i]];
  }
  g_mergesort.input = result;
  //console.log(result);
}

//todo
//Performs one pass of the quick sort
function quickSort(){
  let input = g_quicksort.input;
  let pass = 0;
  let pivot; 
  let l, r;  //Iterators

  for(let i = 0; i < input.length; i++){  //Perform quicksort on each sub-array
    pivot = input[i][0];  //We'll use the first element as our pivot
    l = 1;  //Start after the pivot element
    r = input[i].length - 1;

    do{  //Iterate through a sub-array
      while(input[i][l] <= pivot && l < input[i].length - 1){  //Find an element greater than the pivot
        l++;  
      }
      while(input[i][r] >= pivot && r > 0){  //Find an element smaller than the pivot
        r--;
      }

      //Swap
      let temp = input[i][l];
      input[i][l] = input[i][r];
      input[i][r] = temp;
      l++;
      r--;

    } while(l <= r);

  }

  //Draw pass results
  let x = 51; //x-coord to start drawing at
  for(let i = 0; i < input.length; i++){
    drawArray(input[i], x, g_quicksort.pass + 2);  //Add 2 to pass because the first 2 rows are already used
    x += input[i].length;  //Move right the amount of cells we just wrote to
  }

  //Divide each sub-array at the split point for the next pass
  //todo
  let splitPoint = r;
  let temp = [];
  temp.push(input.slice(0, splitPoint - 1));
  temp.push(input.slice(splitPoint));

  g_quicksort.input = input;
  g_quicksort.pass++;
}

//Performs one pass of the merge sort
function mergeSort(){
  let input = g_mergesort.input;
  let temp = [];  //Array for holding sub-arrays
  let pass = 0; //Counts number of passes made by the loop

  //Iterate through our sub-arrays
  for(let i = 0; i < input.length; i += 2 ){ 
    let l = 0, r = 0; //Iterators for each pair of arrays being merged
    temp.push([]); //Create a sub-array to hold the results of each merge
    
    if(input[i + 1] == undefined){  //Checks if there isn't a pair to merge with
      temp[pass].push(input[i]);  //Since there isn't a pair, don't try to merge
    }
    else{  //Else, merge and sort a pair of arrays
      while(l < input[i].length || r < input[i + 1].length){  //Iterate through both arrays
        if(l >= input[i].length){  //If left array is done, push right element
          temp[pass].push(input[i + 1][r]);
          r++;
        }
        else if(r >= input[i + 1].length){  //If right array is done, push left element
          temp[pass].push(input[i][l]);
          l++;
        }
        else if(input[i][l] < input[i + 1][r]){  //Compare and push the smaller element
          temp[pass].push(input[i][l]);
          l++;
        }
        else{
          temp[pass].push(input[i + 1][r]);
          r++;
        }
      }
    }
    pass++;
  }

  //Draw pass results
  let x = 34; //x-coord to start drawing at
  for(let i = 0; i < temp.length; i++){
    drawArray(temp[i], x, g_mergesort.pass + 2);  //Add 2 to pass because the first 2 rows are already used
    x += temp[i].length;  //Move right the amount of cells we just wrote to
  }

  //Save information from this pass
  g_mergesort.pass++;
  g_mergesort.input = temp;

  //If we only have 1 sub-array left, we are done
  if(temp.length == 1)
    g_mergesort.sorted = true;
}

//Performs one pass of Gold's poresort
function poreSort(){
  let input = g_poresort.input;
  let i = g_poresort.pass % 2;  //Perform sort on either even or odd indexes

  //Check and sort each pair
  while(i < input.length - 1 ){
    let j = i + 1;
    let temp = input[j];
    if(input[i] > input [j]){
      input[j] = input[i];
      input[i] = temp;
    }
    i += 2; //Move to next even/odd index
  }

  //Draw pass results
  drawArray(input, 17, g_poresort.pass + 2); //Increase pass because the first 2 rows are already used

  //Save information from this pass
  g_poresort.pass++;
  g_poresort.input = input;
  
  //Checks if the sort is complete
  g_poresort.sorted = isSorted(input);
}

//Performs one pass of the insertion sort
function insertionSort(){
  let input = g_insertion.input;
  let i = g_insertion.i;
  let j = i - 1;
  let key = input[i];

  //Inserts current char into correct index
  while (j >= 0 && input[j] > key){  
    input[j + 1] = input[j];  
    j--;  
  }  
  input[j + 1] = key;

  //Draw pass results
  drawArray(input, 0, i + 1); //Increase i by 1 because the first 2 rows are already used and i is initialized to 1

  //Save information from this pass
  g_insertion.i = ++i; //Increment iterator for the next pass
  g_insertion.input = input;

  //Checks if the sort is complete
  g_insertion.sorted = isSorted(input);
}

function algoRace(){
  if(!g_insertion.sorted)
    insertionSort();
  if(!g_poresort.sorted)
    poreSort();
  if(!g_mergesort.sorted)
    mergeSort();
  quickSort();

  //Check if we're done shifting the input
  if(g_race_cnt <= g_input.length - 2){
    //If all sorts are done, shift input and sort again
    if(g_insertion.sorted && g_poresort.sorted && g_mergesort.sorted && true ){ //todo remove true placeholder for quicksort
      g_input = shiftArrayRight(g_input);

      //Reset data for each sort
      g_insertion = {input:g_input.slice(), i:1, j:0, sorted:false};
      g_poresort = {input:g_input.slice(), pass:0, sorted:false}; 
      g_mergesort = {input:g_input.slice(), pass:0, sorted:false};
      g_quicksort = {input:g_input.slice(), pass:0, sorted:false};
    
      //Setup grid for next pass
      setup();
      g_race_cnt++;
    }
  }
}

function draw_update(){ // Update our display.
    algoRace();
}

function draw(){  // P5 Frame Re-draw Fcn, Called for Every Frame.
  g_frame_cnt++;
  if (0 == g_frame_cnt % g_frame_mod && g_stop == 0)
    {
      draw_update();
    }  
}

function keyPressed( )
{
    g_stop = ! g_stop;
}