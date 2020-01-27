var btnSearch;
var btnClearWalls;
var speedSlider;
var algoTypeSelector;
var vertexShapeSelector;

var fps;

var grid;
var startVertex;
var endVertex;

var draggedVertex = null;

function setup() {
  //createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  createCanvas(windowWidth, windowHeight);
  fps = FPS;
  frameRate(fps);
  setButtons();
  setSliders();
  setSelectors();
  setGrid();
  setStartVertex();
  setEndVertex();
}

function draw() {
  background(WHITE);
  grid.draw();
}

function setGrid(){
  grid = new Grid(GRID_POS_X, GRID_POS_Y, GRID_ROWS, GRID_COLS);
}

function setStartVertex(){
  grid.setVertexType(START_VERTEX_POS[0], START_VERTEX_POS[1], START_VERTEX);
  startVertex = grid.at(START_VERTEX_POS[0], START_VERTEX_POS[1]);
}

function setEndVertex(){
  grid.setVertexType(END_VERTEX_POS[0], END_VERTEX_POS[1], END_VERTEX);
  endVertex = grid.at(END_VERTEX_POS[0], END_VERTEX_POS[1]);
}

function setButton(value, action, foreColor, backColor, pos, fontSize, borderRadius){
  let btn = createButton(value);
  btn.position(pos[0], pos[1]);
  btn.mousePressed(action);
  btn.style('background-color', backColor);
  btn.style('color', foreColor);
  btn.style('text-align', 'center');
  btn.style('font-size', fontSize);
  btn.style('border-radius', borderRadius);
  return btn;
}

function setButtons(){
  btnSearch = setButton('Search', runSearch, color(YELLOW), color(BLUE), [width / 2 + 200, HEADER_HEIGHT / 3], FONT_SIZE3, '5%');
  btnClearWalls = setButton('Clear Walls', clearWalls, color(YELLOW), color(BLUE), [width / 2 + 400, HEADER_HEIGHT / 3], FONT_SIZE3, '5%');
}

function setSlider(pos, minValue, maxValue, value, step, inputAction){
	let slider = createSlider(minValue, maxValue,value, step);
	slider.position(pos.x, pos.y);
	slider.input(inputAction);
	return slider;
}

function setSliders(){
  speedSlider = setSlider(createVector(SCREEN_WIDTH * 0.2, HEADER_HEIGHT / 2), MIN_SPEED, MAX_SPEED, 1, 1, setSpeed);
}

function setSelector(pos, options, changeAction){
	let sel = createSelect();
	sel.position(pos.x, pos.y);
	for (let option of options){
		sel.option(option);
	}
	sel.changed(changeAction);
	return sel;
}

function setSelectors(){
  algoTypeSelector = setSelector(createVector(SCREEN_WIDTH * 0.4, HEADER_HEIGHT / 2), SEARCH_TYPES, setAlgo);
  vertexShapeSelector = setSelector(createVector(SCREEN_WIDTH * 0.5, HEADER_HEIGHT / 2), VERTEX_SHAPES, setVertexShape)
}

function setEnabled(btn, value){
	if (value){
		btn.removeAttribute('disabled');
	}
	else{
    btn.attribute('disabled', value);
  }
}
	

function setSpeed(){
  fps = speedSlider.value();
  frameRate(fps);
}

function setVertexShape(){

}

async function startSearch(){
  if (algoTypeSelector.value() == 'BFS'){
    return await bfs(grid, startVertex, endVertex);
  }
  else if (algoTypeSelector.value() == 'DFS'){
    return await dfs(grid, startVertex, endVertex);
  }
  else if (algoTypeSelector.value() == 'Dijkstra'){
    return await dijkstra(grid, startVertex, endVertex);
  }
  else if (algoTypeSelector.value() == 'Astar'){
    return await astar(grid, startVertex, endVertex);
  }
}

async function showPath(){
  console.log('Show path...');
  let path = [];
  let v = endVertex;
  while (v != startVertex){
    path.push(v);
    v = v.getParent();
  }
  for (let i = path.length - 1; i >= 0; i--){
    let v = path[i];
    if (v != endVertex && v != startVertex){
      await sleep(DELAY_IN_MILLISEC * 10);
      v.setBackcolor(YELLOW);
    }
  }
}

async function runSearch(){
  console.log('Run search');
  let result = await startSearch();
  console.log('Search finished');
  if (result){
    console.log('Path found.');
    showPath();
  }
  else{
    console.log('No path found.');
  }
}

function clearWalls(){
  for (let vertex of grid.vertices){
    if (vertex.vertexType == WALL_VERTEX){
      vertex.setVertexType(BLANK_VERTEX);
    }
  }
}

function setAlgo(){

}

function chooseVertex(){
  draggedVertex = null;
  for (let vertex of grid.vertices){
    if (vertex.isClicked(mouseX,mouseY)){
      if (vertex.vertexType == START_VERTEX || vertex.vertexType == END_VERTEX){
        draggedVertex = vertex;
        return;
      }
      if (vertex.vertexType == WALL_VERTEX){
        //print('set vertex to blank');
        vertex.setVertexType(BLANK_VERTEX);
      }
      else{
        //print('set vertex to wall');
        vertex.setVertexType(WALL_VERTEX);
      }
      
    }
  }
}

/* Mouse Events */

/*
function mouseMoved(){
  if (mouseIsPressed){
    chooseVertex();
  }
}
*/

function mouseDragged(){
  if (draggedVertex != null){
    for (let vertex of grid.vertices){
      if (vertex.isClicked(mouseX,mouseY)){
        vertex.setVertexType(draggedVertex.vertexType);
        
      }
    }
    return;
  }
  chooseVertex();
}
  

function mousePressed(){
  chooseVertex();
}
