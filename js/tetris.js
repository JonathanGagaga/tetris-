window.$=function(selector){
	return document.querySelectorAll(selector);
}
var tetris={
	RN:20,//row number
	CN:10,//column number
	CELL_SIZE:26,//unit hiehgt and length

	pg:null, //background element 
	IMG_OVER:'img/game-over.png',//gameover image
    IMG_PAUSE:'img/pause.png',//game pausing image
	IMGS:
	{//element, unit picture 
		O:'img/O.png',
		I:'img/I.png',
		T:'img/T.png',
		J:'img/J.png',
		L:'img/L.png',
		S:'img/S.png',
		Z:'img/Z.png'
	},
	//offset value of the x and y
	OFFSET_X:15,
	OFFSET_Y:15,

	shape:null,//current image object
	nextShape:null,//the next image object

	timer:null,
	interval:500,//interval between the current and the next dropdown

    score:0,// score gained
	lines:0,// numbers of lines being deleted 
	level:1,// level of difficulties
	
	wall:null,

	state:0,//game status
	STATE_RUNNING:0,
	STATE_PAUSE:1,
	STATE_OVER:2,
	
	
	//Gain different points based on different eliminated lines
	//o,1,2,3,4,5 lines respectively
    scores:[0,10,50,80,200],

	start:function()
	{
		//initialization of the platform
		this.state=this.STATE_RUNNING;
		this.cells=[];
		this.score=0;
		this.lines=0;
		this.level=1;
		this.pg=$('.playground')[0];
		//initialized all square units
		this.wall=[];	
		for(var i=0; i<this.RN; i++)
		{
			this.wall[i]=new Array(this.CN);
		}

		this.shape=this.randomShape();
		this.nextShape=this.randomShape();
		this.softDrop();
		this.timer=setInterval(function()
		{
			tetris.softDrop();
		},this.interval);
	},
	//Paint all shapes
	paintShape:function()
	{
		
		var frag=document.createDocumentFragment();
		for(var i=0;i<4;i++)
		{
			var c=this.shape.cells[i];
			//when creating the unit
			//col and row number are the multiple coefficient
			//also need to add offsets
			var x=c.col*this.CELL_SIZE+this.OFFSET_X;
			var y=c.row*this.CELL_SIZE+this.OFFSET_Y;
			var img=new Image();
			img.src=c.img;
			//x and y are just numbers
			//so transfer them into "px" domain
			img.style.left=x+'px';
			img.style.top=y+'px';
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},
	//Generate unit shape by Math.random
	randomShape:function()
	{
		switch(parseInt(Math.random()*7))
		{
			case 0: return new O();
			case 1: return new I();
			case 2: return new Z();
			case 3: return new J();
			case 4: return new T();
			case 5: return new S();
			case 6: return new L();
		}
	},
	//function for shape to drop
	softDrop:function()
	{
		if(this.state==this.STATE_RUNNING)
		{
			this.paint();
			//nothing below the shape
			//keep dropping
			if(this.canDrop()){
				this.shape.softDrop();
			}else
			{
				this.landIntoWall();
				//destroy lines and gain points
	            var lines=this.destroyLines();
				this.lines+=lines;
				this.score+=this.scores[lines];
	
				if(this.isGameOver())
				{
					this.gameOver();
				}else
				{
					this.shape=this.nextShape;
					this.nextShape=this.randomShape();
				}
			}
		}
	},
	//Function for gameover
	gameOver:function()
	{
		this.state = this.STATE_OVER;
		clearInterval(this.timer);
		this.timer=null;
		this.paint();
	},
	//Record the score
	paintScore:function()
	{
		$(".playground span")[0].innerHTML=this.score;
		$(".playground span")[1].innerHTML=this.lines;
		$(".playground span")[2].innerHTML=this.level;
	},
	//Function for painting
	paint:function()
	{
		this.pg.innerHTML=this.pg.innerHTML.replace(/<img(.*?)>/g,"");
		this.paintWall();
		this.paintShape();
		this.paintNextShape();
		this.paintScore();
		this.paintState();
	},
	//Paint background wall
	paintWall:function()
	{
        for(var row=0; row<this.RN; row++)
        {
			for(var col=0; col<this.CN; col++)
			{
				var cell = this.wall[row][col];
				var x = col * this.CELL_SIZE+this.OFFSET_X;
				var y = row * this.CELL_SIZE+this.OFFSET_Y;
				if(cell)
				{
					var img = new Image();
					img.src = cell.img;
					img.style.left = x+'px';
					img.style.top = y+'px';
					this.pg.appendChild(img);
				}
			}
		}
	},
	//Function for painting the next shape
	paintNextShape:function(){
		var cells = this.nextShape.cells;
		var frag=document.createDocumentFragment();
		for(var i=0; i<cells.length; i++){
			var c = cells[i];
			var row = c.row + 1;
			var col = c.col + 11;
			var x = col * this.CELL_SIZE;
			var y = row * this.CELL_SIZE;
			var img = new Image();
			img.src = c.img;
			img.style.left = x+'px';
			img.style.top = y+'px';
			frag.appendChild(img);
		}	
		this.pg.appendChild(frag);
	},
	//function for juedging whether the shape can drop or not
	canDrop:function() {
		var cells = this.shape.cells;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			//if the cell reaches the bottom of the border
			//cannot drop
			if(cell.row==(this.RN-1)){
				return false;
			}
		}
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			if(this.wall[cell.row+1][cell.col]!=null){
				return false;
			}
		}
		return true;
	},
	//functions for shapes land on the wall
	landIntoWall:function() {
		var cells = this.shape.cells;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			this.wall[cell.row][cell.col] = cell;
		}
	},
	//Draw the gaming picture
	paintState:function()
	{
		var img=new Image();
		switch (this.state)
		{
		    case this.STATE_OVER:
			    img.src=this.IMG_OVER;
			    break;
			case this.STATE_PAUSE:
				img.src=this.IMG_PAUSE;
				break;
		}
		this.pg.appendChild(img);
	},
	//function for judging whether it is over
	isGameOver:function() {
		var cells = this.nextShape.cells;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			if(this.wall[cell.row][cell.col]!=null){
				return true;
			}
		}
		return false;
	},
	//Judge if the shape is going out of the border
	outOfBounds:function() 
	{
		var cells=this.shape.cells;
		for(var i=0; i<cells.length; i++)
		{
			if(cells[i].row<0||cells[i].row>=this.RN||
			   cells[i].col<0||cells[i].col>=this.CN){
				return true;
			}
		}
		return false;
	},
    //Judge that if there is a shape in the focusing boundary
	concide:function() {
		var cells=this.shape.cells;
		for(var i=0; i<cells.length; i++){
			if(this.wall[cells[i].row][cells[i].col]){
				return true;
			}
		}
		return false;
	},
	//Moving to the right
	moveRight:function(){
		if(this.state==this.STATE_RUNNING){
			this.shape.moveRight();
			//if it is going to be out of border
			//make a negative reaction 
			if(this.outOfBounds()||this.concide()){
				this.shape.moveLeft();
			}
		}
	},
    //Moving to the left
	moveLeft:function(){
		if(this.state==this.STATE_RUNNING){
			this.shape.moveLeft();
			//if it is going to be out of border
			//make a negative reaction 
			if(this.outOfBounds()||this.concide()){
				this.shape.moveRight();
			}
		}
	},
	//Using keydown to use keyboard to control the shape
	keydown:function(e){
		var key=e.which||e.keyCode||e.charCode;
		switch(key){
			case 37:this.moveLeft(); break;		//move left
			case 39:this.moveRight(); break;	//move right
			case 40:this.softDrop(); break;	    //moving faster down
			
			case 38:this.rotateR();break;//clockwise rotation
			case 90:this.rotateL();break;//counterclockwise rotation
			
			case 80:this.pause();break; //pasu the game
			case 67:this.myContinue();break; //continue the game

			case 81:this.gameOver();break; //quit the game to a gameover 
			case 83:
				if(this.state==this.STATE_OVER){
					this.start(); //start the game only when the game is over/ unstarted
				}break;
		}
	},
	
	//clockwise rotation function
	rotateR:function(){
		if(this.state==this.STATE_RUNNING){
			this.shape.rotateR();
			if(this.outOfBounds() || this.concide()){
				this.shape.rotateL();
			}
		}
	},
	//counterclockwise rotation function
	rotateL:function(){
		if(this.state==this.STATE_RUNNING){
			this.shape.rotateL();
			if(this.outOfBounds() || this.concide()){
				this.shape.rotateR();
			}
		}
	},
	//pause game function
	pause:function(){
		if(this.state==this.STATE_RUNNING){
			clearInterval(this.timer);
			this.timer=null;
			this.state=this.STATE_PAUSE;
			this.paint();
		}
	},
	//continure game function
	myContinue:function(){
		if(this.state==this.STATE_PAUSE){
			this.state=this.STATE_RUNNING;
			this.timer=setInterval(function(){
				tetris.softDrop();
			},this.interval);
		}
	},
	//destroy lines function
    destroyLines:function() {
		for(var row=0,lines=0; row<this.RN; row++){
			if(this.fullCells(row)){
				this.deleteRow(row);
				lines++;
			}
		}
		return lines;
	},
	//destroy the specific row function
	deleteRow:function(row){
		for(var i=row; i>=1; i--){
			for(var j=0; j<this.CN; j++){
				this.wall[i][j]=this.wall[i-1][j];
			}
		}
	},
    //judge if the row is full to be deleted
	fullCells:function(row) {
		var line = this.wall[row];
		for (var i = 0; i < line.length; i++) {
			var cell = line[i];
			if(cell==null){
				return false;
			}
		}
		return true;
	}
}

window.onload=function(){
	tetris.start();
	document.onkeydown=function(){
		var e=window.event||arguments[0];
		tetris.keydown(e);
	}
}