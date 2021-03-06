////////////////////////////////////////////////////////////////////////////////
// Change from fixed steps to timed updates
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window, container, Stats*/

var camera, scene, renderer, stats;
var cameraControls;

var clock = new THREE.Clock();

var cylinder, sphere, cube;

var bevelRadius = 1.9;	// TODO: 2.0 causes some geometry bug.

var headlight;

var mouseDown = 0;

var bird, pencil;

var tiltDirection = 1;

var smoothX = 0, smoothY = 0;
var line;
var mouseX = 0.0; mouseY = 0.0;
var prevMouseX = 0.0; prevMouseY = 0.0;

//var canvasWidth = 846;
//var canvasHeight = 494;

 var material = new THREE.LineBasicMaterial({
        color: 0x1F1F1F
    });


document.getElementsByTagName("body")[0].style.cursor = "url('none.png'), auto";



$(document).mousedown(function() {
   mouseDown = 1;
});


$(document).mouseup(function() {
   mouseDown = 0;	
});

$(document).on('mousemove',function(e){

      prevMouseX = smoothX;
	  prevMouseY = smoothY;
	 

	  mouseX =  (e.clientX - canvasWidth/2.0) * 2.0;// - canvasWidth	
	  mouseY =  (e.clientY - canvasHeight/2.0) * 2.0;// - canvasHeight;
	  
     alpha = 0.7;
	 smoothX  = alpha * smoothX + (1 - alpha) * mouseX;
	 smoothY = alpha * smoothY + (1 - alpha) * mouseY;

     	 
			
	if(mouseDown)
	{
		  createLine();	  
	}
	});

	
function init() {
	// For grading the window is fixed in size; here's general code:
	canvasWidth = window.innerWidth / 1.4;
	canvasHeight = window.innerHeight / 1.4;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0x0, 1.0 );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap; 

	// CAMERA
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 4000 );
	camera.position.set(0, 1400, 0 );
	//camera.position.set( 19,1678,1688);

	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0,310,0);

	var delta = clock.getDelta();
	cameraControls.update(delta);

	


}

function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x0, 2000, 4000 );

	// LIGHTS
	scene.add( new THREE.AmbientLight( 0x222222 ) );

	headlight = new THREE.PointLight( 0xFFFFFF, 1.0 );
	scene.add( headlight );

	var light = new THREE.SpotLight( 0xFFFFFF, 1.0 );
	light.position.set( -500, 1200, 300 );
	light.angle = 90 * Math.PI / 180;
	light.exponent = 1;
	light.target.position.set( -200,0,-100);
	light.castShadow = true;
	light.shadowCameraFov = 85;
	light.shadowMapWidth = 2048; // default is 512
	light.shadowMapHeight = 2048; // default is 512

	scene.add( light );

	
	// pencil
	pencil = new THREE.Object3D();
	createpencil(pencil);
   
	scene.add( pencil );

		var texture = THREE.ImageUtils.loadTexture('page3.jpg', {}, function() {
         renderer.render(scene);
        });

		pageMaterial = new THREE.MeshLambertMaterial ({map: texture,  specular: 0x555555, shininess: 20});		
		

	 var solidGround = new THREE.Mesh(
	new THREE.PlaneGeometry( 2000, 2000),
	pageMaterial);
	 solidGround.rotation.x = - Math.PI / 2;
     solidGround.receiveShadow = true;
	 scene.add( solidGround );


}

function createLine()
{
 
   var geometry = new THREE.Geometry();
   
   // taking y as 2, to remove inteference with papaer at y = 0
   geometry.vertices.push(new THREE.Vector3(prevMouseX, 2, prevMouseY));
   geometry.vertices.push(new THREE.Vector3(smoothX, 2, smoothY));	
   
   line = new THREE.Line(geometry, material);
   scene.add(line);
}




      function createpencil(ppencil)
	  {	
	    var rubber_length= 10;
		var pencil_length = 330;
		var pencil_radius = 40;
		var tip_radius = 10;
		var neck_length = 60;
		var tip_length = 20;
	

		var pencilMaterial  = new THREE.MeshPhongMaterial({ ambient: 0x964514, color: 0xE3A869	, specular: 0x555555, shininess: 20 });
		var tipMaterial  = new THREE.MeshPhongMaterial({ ambient: 0x964514, color: 0x000000	, specular: 0x555555, shininess: 20 });

		//var texture = THREE.ImageUtils.loadTexture( 'halloween.jpg');

		 texture = THREE.ImageUtils.loadTexture('halloween.jpg', {}, function() {
         renderer.render(scene);
        });

		paintMaterial = new THREE.MeshPhongMaterial({map: texture, specular: 0xFFFFFF, shininess: 120 });		
		pencilMaterial.side = THREE.DoubleSide;
	    
		 // rubber
		var cylinder;
		cylinder = new THREE.Mesh(
		new THREE.CylinderGeometry( pencil_radius, pencil_radius, rubber_length, 32, 10, 0 ), tipMaterial );
		
		
		cylinder.position.x = mouseX;	
		cylinder.position.y = pencil_length + neck_length + tip_length + rubber_length/2;	
		cylinder.position.z = mouseY;	
		cylinder.castShadow = true;
		cylinder.receiveShadow = false;
		//scene.add( cylinder );
		ppencil.add(cylinder);


	    // body
		var cylinder;
		cylinder = new THREE.Mesh(
		new THREE.CylinderGeometry( pencil_radius, pencil_radius, pencil_length, 32, 10, 0 ), paintMaterial );
		
				

		cylinder.position.x = mouseX;	
		cylinder.position.y = pencil_length/2 + neck_length + tip_length;	
		cylinder.position.z = mouseY;	
		cylinder.castShadow = true;
		cylinder.receiveShadow = false;
		//scene.add( cylinder );
		ppencil.add(cylinder);
			
		
	    // neck
		var cylinder;
		cylinder = new THREE.Mesh(
		new THREE.CylinderGeometry( pencil_radius, tip_radius, neck_length, 32, 10, 0 ), pencilMaterial );
		
		
		cylinder.position.x = mouseX;	
		cylinder.position.y = neck_length/2 + tip_length;	
		cylinder.position.z = mouseY;	
		cylinder.castShadow = true;
		cylinder.receiveShadow = false;
		//scene.add( cylinder );
		ppencil.add(cylinder);
		
			
	    // tip
		var cylinder;
		cylinder = new THREE.Mesh(
		new THREE.CylinderGeometry( tip_radius, 0, tip_length, 32, 10, 1 ), tipMaterial );
		
		
		cylinder.position.x = mouseX;	
		cylinder.position.y = tip_length/2;	
		cylinder.position.z = mouseY;	
		cylinder.castShadow = true;
		cylinder.receiveShadow = false;
		//scene.add( cylinder );
		ppencil.add(cylinder);

		ppencil.rotation.y = 60;
		ppencil.rotation.x = 20;
		ppencil.rotation.z = 44.5;
		
	  }


function addToDOM() {

	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function drawHelpers() {

}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	
	pencil.position.x = mouseX 	;
	pencil.position.z = mouseY ;	
	headlight.position.copy( camera.position );
	renderer.render(scene, camera);
}

try {
	init();
	fillScene();
	drawHelpers();
	addToDOM();
	animate();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
