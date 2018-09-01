var signageApp = angular.module('signageApp', [
	'ngAnimate', 
	'ui.bootstrap', 
	'ui.router',
]);


//Configuring ui.router states
signageApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');
	$stateProvider	
	
	.state('home', {
		url: '/home',
		templateUrl: 'templates/home.html'
	})
	
	.state('about', {
		url: '/about',
		templateUrl: 'templates/about.html'
	})
	
	.state('contact', {
		url: '/contact',
		templateUrl: 'templates/contact.html'
	})
	//TEST for sign customizer
	.state('test', {
		url: '/test',
		templateUrl: 'customize_TEST.html',
		controller: 'customizerController'
	})
	//END TEST
	.state('products', {
		url: '/products',
		views: {
			'': {
				templateUrl: 'templates/products.html', 
				controller: 'productsController'
			},
			'productsView@products': {
				templateUrl: 'templates/products-default.html'			
			}
		}
	})
	//child states of Products
	.state('products.yardsigns', {
		url: '/yardsigns',
		views: {
			'productsView@products': {
				templateUrl: 'templates/products.yardsigns.html',
				controller: 'yardsignsController'
			}
		}
	})
	.state('products.banners', {
		url: '/banners',
		views: {
			'productsView@products': {
				templateUrl: 'templates/products.banners.html'
			}
		}
	})
	.state('products.checks', {
		url: '/checks',
		views: {
			'productsView@products': {
				templateUrl: 'templates/products.checks.html'
			}
		}
	})
	.state('products.prize', {
		url: '/prize',
		views: {
			'productsView@products': {
				templateUrl: 'templates/products.prize.html'
			}
		}
	});
	
});

signageApp.controller('productsController', function($scope) {	
	//test items, will probably change formats before launch
	var itemobj = {qty: '1', desc: 'Item Description', price: 3.50, image: 'placeholder1.png'};
	var itemobj2 = {qty: '3', desc: 'Second Item', price: 23.00, image: 'placeholder1.png'};
	var itemobj3 = {qty: '6', desc: 'Another Item', price: 12.00, image: 'placeholder1.png'};
	var itemobj4 = {qty: '2', desc: 'Fourth Item', price: 73.25, image: 'placeholder1.png'};
	var itemobj5 = {qty: '4', desc: 'Final Cart Item', price: 45.75, image: 'placeholder1.png'};
	var itemobj6 = {qty: '4', desc: 'Test Item 6', price: 45.75, image: 'placeholder1.png'};
	var itemobj7 = {qty: '4', desc: 'Test Item 7', price: 45.75, image: 'placeholder1.png'};
	var itemobj8 = {qty: '4', desc: 'Test Item 8', price: 45.75, image: 'placeholder1.png'};
	var itemobj9 = {qty: '4', desc: 'Test Item 9', price: 45.75, image: 'placeholder1.png'};
	//very basic cart test, nowhere near complete
	var cart = [itemobj, itemobj2, itemobj3, itemobj4, itemobj5];
	$scope.cart = cart;
	var i;
	var sub = 0;
	for (i = 0; i < cart.length; i++){
		sub+= cart[i].price;
		$scope.subtotal = sub;
	}	
});

signageApp.controller('yardsignsController', function($scope){
	//Test items, YARD SIGNS, names in 'desc' based off of the names given in the mock-up
	var yardsign1 = {desc: 'Hole Sponsor', image: 'placeholder1.png'};
	var yardsign2 = {desc: 'Longest Drive', image: 'placeholder1.png'};
	var yardsign3 = {desc: 'Closest to Pin', image: 'placeholder1.png'};
	var yardsign4 = {desc: 'Accurate Drive', image: 'placeholder1.png'};
	var yardsign5 = {desc: 'Registration', image: 'placeholder1.png'};
	var yardsign6 = {desc: 'Cart Sponsor', image: 'placeholder1.png'};
	var yardsign7 = {desc: 'Drink Sponsor', image: 'placeholder1.png'};
	var yardsign8 = {desc: 'Food Sponsor', image: 'placeholder1.png'};
	var ys = [yardsign1, yardsign2, yardsign3, yardsign4, yardsign5, yardsign6, yardsign7, yardsign8];
	$scope.thumbnails = ys;	
});


//TEST Customizer Controller
signageApp.controller('customizerController', function($scope){
	var container = new PIXI.Container();
	var signagetemplate = "placeholderSIGN.png"; //SIGNAGE ITEM IMAGE HERE
	var loader = PIXI.loader;
	var canwidth;
	var canheight;
	var renderer = PIXI.autoDetectRenderer({
		transparent: true,
		resolution: 1
	});
	var objects = [];
	var deleteflag = false;
	
	loader.add("signtemp", signagetemplate)
	loader.on('complete', function(loader, resources) {
		var signitem = new PIXI.Sprite(loader.resources.signtemp.texture);
		canwidth = signitem.width;
		canheight = signitem.height;
		container.addChild(signitem);
	})
	loader.load(setup);
	
	
	function setup() {
		renderer.resize(canwidth, canheight);
		renderer.render(container);
		loader.reset();
	}
	
	document.getElementById('display').appendChild(renderer.view);
	
	//Image upload tool
	document.getElementById('userimage').addEventListener("change", function(){
		var file = this.files[0];
		var img = new Image();
		img.src = URL.createObjectURL(file);
		var canwidth = renderer.width;
		var canheight = renderer.height;	
		var base = new PIXI.BaseTexture(img);
		var texture = new PIXI.Texture(base);
		var userimg = new PIXI.Sprite(texture);
		document.getElementById('userimage').value = "";
		userimg.interactive = true;
		userimg.x = canwidth * 0.5;
		userimg.y = canheight * 0.5;
		
		userimg.buttonMode = true;
		
		userimg.anchor.set(0.5);
		userimg.mouseover = function(mouseData) {
			console.log("OVER: userimg")
			if (deleteflag == true){
				this.alpha = 1;
				userimg.tint = 0xFF9980;
				userimg.defaultCursor = "url(erasericon.png), crosshair";
				} else {
				this.alpha = 0.5;
				userimg.tint = 0xFFFFFF;
				userimg.defaultCursor = 'move';
			}
		}
		userimg.mouseout = function(mouseData) {
			this.alpha = 1;
			userimg.tint = 0xFFFFFF;
		}
		userimg
		.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)
		.on('mousedown', onDragStart)
		.on('touchstart', onDragStart)
		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove)
		.on('mousedown', deleteImg)
		.on('pointerdown', deleteImg)
		.on('touchstart', deleteImg);
		
		container.addChild(userimg);
		objects.push(userimg);
		
		animate();
		function animate(){
			requestAnimationFrame(animate);
			renderer.render(container);
		}
		function onDragStart(e){
			userimg.data = e.data;
			userimg.dragging = true;
			
		}
		function onDragEnd(){
			userimg.alpha = 1;
			userimg.dragging = false;
			userimg.data = null;
			console.log("onDragEnd: userimg")
		}
		function onDragMove(){
			if (userimg.dragging){
				var newPosition = userimg.data.getLocalPosition(userimg.parent);
				userimg.position.x = newPosition.x;
				userimg.position.y = newPosition.y;
			}
		}
		
		function deleteImg(){
			if (deleteflag == true){
				container.removeChild(userimg);
				deleteflag = false;
			}
		}
	})
	
	//Text Tool
	var textButton = document.querySelector('#inserttext');	
	textButton.onclick = function(){
		var userformfont = document.getElementById("signfont").value;
		var userformtext = document.getElementById("signtext").value;
		var userformcolor = document.getElementById("signtextcolor").value;
		var userformtxtsize = document.getElementById("userformtxtsize").value;
		var text = new PIXI.Text(userformtext,{fontFamily: userformfont, 
			breakWords: true, wordWrap: true, wordWrapWidth: canwidth, fill: 
		userformcolor, fontSize: userformtxtsize});
		text.x = canwidth * 0.5;
		text.y = canheight * 0.5;
		text.anchor.set(0.5);
		text.interactive = true;
		text.buttonMode = true;
		text.mouseover = function(mouseData) {
			if (deleteflag == true){
				this.alpha = 1;
				text.tint = 0xFF9980;
				text.defaultCursor = "url(erasericon.png), crosshair";
				
				} else {
				text.tint = 0xFFFFFF;
				this.alpha = 0.5;
				text.defaultCursor = 'move';
			}
		}
		text.mouseout = function(mouseData) {
			this.alpha = 1;
			text.tint = 0xFFFFFF;
		}
		text
		.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
		.on('pointermove', onDragMove)
		.on('mousedown', onDragStart) //For some reason, pointer functions alone don't work
		.on('touchstart', onDragStart)
		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove)
		.on('mousedown', deleteText)
		.on('pointerdown', deleteText)
		.on('touchstart', deleteText);
		container.addChild(text);
		
		objects.push(text);
		
		animate();
		function animate(){
			requestAnimationFrame(animate);
			renderer.render(container);
		}
		function onDragStart(e){
			text.data = e.data;
			text.dragging = true;
		}
		function onDragEnd(){
			text.dragging = false;
			text.alpha = 1;
			text.data = null;
		}
		function onDragMove(){
			if (text.dragging){
				var newPosition = text.data.getLocalPosition(text.parent);
				text.position.x = newPosition.x;
				text.position.y = newPosition.y;
			}
		}
		
		function deleteText(){
			if (deleteflag == true){
				container.removeChild(text);
				deleteflag = false;
			}
		}
	}
	
	var removeButton = document.querySelector('#removemode');
	removeButton.onclick = function(){
		if (deleteflag == false){
			deleteflag = true;
			} else {
			deleteflag = false;
		}
	}
	
});