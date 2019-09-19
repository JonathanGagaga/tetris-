function Cell(row, col, img){
	//each cell's row and col numbers
	this.row = row; 
	this.col = col;
	this.img = img;
	//each cell drops down
    if(!Cell.prototype.softDrop){
		Cell.prototype.softDrop=function(){this.row++;}
	}

	//each cell moves to the right
	if(!Cell.prototype.moveRight){
		Cell.prototype.moveRight=function(){this.col++;}
	}
    //each cell moves to the left
    if(!Cell.prototype.moveLeft){
		Cell.prototype.moveLeft=function(){this.col--;}
	}
	
}

// different rotation positions of each shape
function State(row0,col0, row1, col1, row2, col2, row3, col3){
	this.row0 = row0;
	this.col0 = col0;
	this.row1 = row1;
	this.col1 = col1;
	this.row2 = row2;
	this.col2 = col2;
	this.row3 = row3;
	this.col3 = col3;
}
//all shapes' father types, including images and rotational origin location
function Shape(img,orgi){
	this.img=img;
	this.orgi=orgi;

	this.statei=0;
	this.states=[];

	//drops down of 4 cells
    if(!Shape.prototype.hasOwnProperty("softDrop"))
		Shape.prototype.softDrop = function(){
		for(var i=0;i<4;i++){
			this.cells[i].softDrop();
		}
	}

	//the whole shape move right
	//by moving each cells to the right
    if(!Shape.prototype.moveRight){
		Shape.prototype.moveRight=function(){
			for(var i=0; i<this.cells.length; i++){
				this.cells[i].moveRight();
			}
		}
	}
	//the whole shape move left
	//by moving each cells to the left
    if(!Shape.prototype.moveLeft){
		Shape.prototype.moveLeft=function(){
			for(var i=0; i<this.cells.length; i++){
				this.cells[i].moveLeft();
			}
		}
	}

	if(!Shape.prototype.rotateR){
		Shape.prototype.rotateR=function(){
			//check if it is shape O
			if(Object.getPrototypeOf(this)!=O.prototype){
				
				this.statei!=this.states.length-1?
				this.statei++:this.statei=0;
				var state=this.states[this.statei]; 
				var r=this.cells[this.orgi].row;	
				var c=this.cells[this.orgi].col;
				for(var i=0;i<this.cells.length;i++){
					this.cells[i].row = r + state["row"+i];
					this.cells[i].col = c + state["col"+i];
				}
			}
		}
	}
	if(!Shape.prototype.rotateL){
		Shape.prototype.rotateL=function(){
			//check if it is shape O
			if(Object.getPrototypeOf(this)!=O.prototype){
			this.statei!=0?
			this.statei--:this.statei=this.states.length-1;
			var state=this.states[this.statei]; 
			var r=this.cells[this.orgi].row;	
			var c=this.cells[this.orgi].col;
			for(var i=0;i<this.cells.length;i++){
				this.cells[i].row=r+state["row"+i];
				this.cells[i].col=c+state["col"+i];
			}
			}
		}
	}
}

// creat O shape
// creat their positions
//fix their tag for each cell
function O(){
	Shape.call(this,tetris.IMGS.O,0);
	Object.setPrototypeOf(O.prototype,new Shape());
	this.cells=[
		new Cell(0,4,this.img),new Cell(0,5,this.img),
		new Cell(1,4,this.img),new Cell(1,5,this.img)
	];
}

// creat I shape
// creat their positions
//fix their tag for each cell

function I(){
	Shape.call(this,tetris.IMGS.I,1);
	Object.setPrototypeOf(I.prototype,new Shape());
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),
		new Cell(0,5,this.img),
		new Cell(0,6,this.img)
	];
	this.states[0]=new State(0,-1, 0,0, 0,1, 0,2);
	this.states[1]=new State(-1,0, 0,0, 1,0, 2,0);
}
// creat T shape
// creat their positions
//fix their tag for each cell
function T(){
	Shape.call(this,tetris.IMGS.T,1);
	Object.setPrototypeOf(T.prototype,new Shape());
	this.cells=[
new Cell(0,3,this.img),new Cell(0,4,this.img),new Cell(0,5,this.img),
				  new Cell(1,4,this.img)
	];
	this.states[0] = new State(0,-1, 0,0, 0,1, 1,0);
	this.states[1] = new State(-1,0, 0,0, 1,0, 0,-1);
	this.states[2] = new State(0,1, 0,0, 0,-1, -1,0);
	this.states[3] = new State(1,0, 0,0, -1,0, 0,1);
}

// creat S shape
// creat their positions
//fix their tag for each cell
function S(){
	Shape.call(this,tetris.IMGS.S,3);
	Object.setPrototypeOf(S.prototype,new Shape());
	this.cells=[
		new Cell(0,4,this.img),
		new Cell(0,5,this.img),
		new Cell(1,3,this.img),
		new Cell(1,4,this.img)
	];

	this.states[0] = new State(0,-1, -1,0, -1,1, 0,0);
	this.states[1] = new State(-1,0, 0,1, 1,1, 0,0);
}
// creat Z shape
// creat their positions
//fix their tag for each cell
function Z(){
	Shape.call(this,tetris.IMGS.Z,2);
	Object.setPrototypeOf(Z.prototype,new Shape());
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),
		new Cell(1,4,this.img),
		new Cell(1,5,this.img)
	];

	this.states[0] = new State(-1,-1, -1,0, 0,0, 0,1);
	this.states[1] = new State(-1,1, 0,1, 0,0, 1,0);
}
// creat L shape
// creat their positions
//fix their tag for each cell
function L(){
	Shape.call(this,tetris.IMGS.L,1);
	Object.setPrototypeOf(L.prototype,new Shape());
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),
		new Cell(0,5,this.img),
		new Cell(1,3,this.img)
	];

	this.states[0] = new State(0,1, 0,0, 0,-1, -1,1);
	this.states[1] = new State(1,0, 0,0, -1,0, 1,1);
	this.states[2] = new State(0,-1, 0,0, 0,1, 1,-1);
	this.states[3] = new State(-1,0, 0,0, 1,0, -1,-1);
}
// creat J shape
// creat their positions
//fix their tag for each cell
function J(){
	Shape.call(this,tetris.IMGS.J,1);
	Object.setPrototypeOf(J.prototype,new Shape());
	this.cells=[
		new Cell(0,3,this.img),
		new Cell(0,4,this.img),
		new Cell(0,5,this.img),
		new Cell(1,5,this.img)
	];

	this.states[0] = new State(0,-1, 0,0, 0,1, 1,1);
	this.states[1] = new State(-1,0, 0,0, 1,0, 1,-1);
	this.states[2] = new State(0,1, 0,0, 0,-1, -1,-1);
	this.states[3] = new State(1,0, 0,0, -1,0,-1,1);
}
