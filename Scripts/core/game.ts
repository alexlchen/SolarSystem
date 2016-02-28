/** Source file name: game.ts */
/** Author: Liyi Chen   */
/** Last modified: Liyi Chen*/
/** Date last Modified: Feb 26 2016 */
/** Description: This project is buildt on the base of The temperate project that created by Professor 
 *  Tom Tsiliopoulos who is teaching COMP392 - Advanced Graphic. 
 *  The purpose of this project is simulating the Solar System's movement. 
 *  The project is built on TypeScript, JavaScript, THREE.js and so on.
 *  Use the mousewhell to zoom in/ out the scene
 *  You can also use the control panel to change the ambient light color, move the camera horizontally 
 *  and/or vertically. Or you can even turn on the moveCamera to move the camera automatically*/
 
/// <reference path="_reference.ts"/>

// MAIN GAME FILE

// THREEJS Aliases
import Scene = THREE.Scene;
import Renderer = THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import BoxGeometry = THREE.BoxGeometry;
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import Material = THREE.Material;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import HemisphereLight = THREE.HemisphereLight;
import AmbientLight = THREE.AmbientLight;
import Control = objects.Control;
import GUI = dat.GUI;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import Point = objects.Point;
import CScreen = config.Screen;
import Clock = THREE.Clock;
import FirstPersonControls = THREE.FirstPersonControls;

//Custom Game Objects
import gameObject = objects.gameObject;

// setup an IIFE structure (Immediately Invoked Function Expression)
var game = (() => {

    var scene: Scene = new Scene();
    var renderer: Renderer;
    var camera: PerspectiveCamera;
    var axes: AxisHelper;
    var plane: Mesh;
    var rotationSpeed; //earth rotation speed
    var moveCamera;
    
    var sun: Mesh;
    var earth:Mesh;
    var moon:Mesh;
    var mars:Mesh;
    var venus:Mesh;
    
    var sunGeometry: SphereGeometry;
    var sunMaterial: LambertMaterial;
    
    var earthGeometry: SphereGeometry;
    var earthMaterial: LambertMaterial;
    
    var moonGeometry: SphereGeometry;
    var moonMaterial: LambertMaterial;
    
    var marsGeometry: SphereGeometry;
    var marsMaterial: LambertMaterial;
    
    var venusGeometry: SphereGeometry;
    var venusMaterial: LambertMaterial;
    
    var ambientColor;
    var ambientLight: AmbientLight;
    var spotLight: SpotLight;
    var hemiLight: HemisphereLight;
    var speedControl: Control;
    var gui: GUI;
    var stats: Stats;
    var step: number = 0;
    var clock: Clock;
    var firstPersonControls
    var pointLightSun;
    var pointLightFront;
    var pointLightBack;
    var pointLightLeft;
    var pointLightRight;
    var pointLightTop;
    var pointLightButtom;
    
    function init() {
        // Instantiate a new Scene object
        //scene = new Scene();

        // setup a THREE.JS Clock object
        clock = new Clock();
        setupRenderer(); // setup the default renderer
        setupCamera(); // setup the camera

        //Add a Plane to the Scene
        //plane = new gameObject( new PlaneGeometry(20, 20, 1, 1), new LambertMaterial({ color: 0xf4a460 }),  0, 0, 0);
        //plane.rotation.x = -0.5 * Math.PI;
        //plane.name = "ground";
        //scene.add(plane);
        //console.log("Added Plane Primitive to scene...");
    
        // Add a sun to the Scene
        sunGeometry = new SphereGeometry(3, 32, 32);
        sunMaterial = new LambertMaterial({ color: 0xFCD440, wireframe:false });
        sun= new gameObject(sunGeometry, sunMaterial, 0, 0, 0);
        sun.name = "Sun";
        scene.add(sun);
        console.log("Added sun Primitive to the scene");
    
        // Add a earth to the Scene
        earthGeometry = new SphereGeometry(1.5, 32, 32);
        earthMaterial = new LambertMaterial({ color: 0x0000ff, wireframe:false });
        earth= new gameObject(earthGeometry, earthMaterial, 15, 0, 0);
        earth.name = "Earth";
        scene.add(earth);
        console.log("Added earth Primitive to the scene");
        
        // Add a moon to the Scene
        moonGeometry = new SphereGeometry(0.5, 32, 32);
        moonMaterial = new LambertMaterial({ color: 0xeeeeee, wireframe:false });
        moon= new gameObject(moonGeometry, moonMaterial, 12, 0, 0);
        moon.name = "Moon";
        scene.add(moon);
        console.log("Added moon Primitive to the scene");
        
        // Add a mars to the Scene
        marsGeometry = new SphereGeometry(0.8, 32, 32);
        marsMaterial = new LambertMaterial({ color: 0x913e11, wireframe:false });
        mars= new gameObject(marsGeometry, marsMaterial, 18, 0, 0);
        mars.name = "Mars";
        scene.add(mars);
        console.log("Added mars Primitive to the scene");
        
        // Add a venus to the Scene
        venusGeometry = new SphereGeometry(0.85, 32, 32);
        venusMaterial = new LambertMaterial({ color: 0xf4a460, wireframe:false });
        venus= new gameObject(venusGeometry, venusMaterial, 8, 0, 0);
        venus.name = "Mars";
        scene.add(venus);
        console.log("Added venus Primitive to the scene");
        
        // setup first person controls
        /*firstPersonControls = new FirstPersonControls(sphere);
        firstPersonControls.lookSpeed = 0.4;
        firstPersonControls.movementSpeed = 10;
        firstPersonControls.lookVertical = true;
        firstPersonControls.constrainVertical = true;
        firstPersonControls.verticalMin = 0;
        firstPersonControls.verticalMax = 2.0;
        firstPersonControls.lon = -150;
        firstPersonControls.lat = 120;*/
    
    
        // add an axis helper to the scene
        axes = new AxisHelper(2);
        earth.add(axes);
        //sun.add(axes);
        console.log("Added Axis Helper to scene...");
    	
        //point light - sun light
        var pointColor = "#ffffff"; //white sun light
        pointLightSun = new THREE.PointLight(pointColor);
        pointLightSun.position.copy(sun.position);
        pointLightSun.position.x += 0;
        pointLightSun.position.y += 0;
        pointLightSun.position.z -= 0;
        pointLightSun.distance = 500;
        scene.add(pointLightSun);
        
/*         
        var pointColor = "#ffffff"; //white sun light
        pointLightFront = new THREE.PointLight(pointColor);
        pointLightFront.position.copy(sun.position);
        pointLightFront.position.x += 0;
        pointLightFront.position.y += 0;
        pointLightFront.position.z -= 0;
        pointLightFront.distance = 500;
        scene.add(pointLightFront);
        
        //point light - back
        pointLightBack = new THREE.PointLight(pointColor);
        pointLightBack.position.copy(sun.position);
        pointLightBack.position.x += 0;
        pointLightBack.position.y += 0;
        pointLightBack.position.z += 8;
        pointLightBack.distance = 500;
        scene.add(pointLightBack);
        
        //point light - left
        pointLightLeft = new THREE.PointLight(pointColor);
        pointLightLeft.position.copy(sun.position);
        pointLightLeft.position.x += 8;
        pointLightLeft.position.y += 0;
        pointLightLeft.position.z -= 0;
        pointLightLeft.distance = 500;
        scene.add(pointLightLeft);
       
       //point light - right
        pointLightRight = new THREE.PointLight(pointColor);
        pointLightRight.position.copy(sun.position);
        pointLightRight.position.x -= 8;
        pointLightRight.position.y += 0;
        pointLightRight.position.z -= 0;
        pointLightRight.distance = 500;
        scene.add(pointLightRight);
        
        //point light - top
        pointLightTop = new THREE.PointLight(pointColor);
        pointLightTop.position.copy(sun.position);
        pointLightTop.position.x -= 0;
        pointLightTop.position.y += 8;
        pointLightTop.position.z -= 0;
        pointLightTop.distance = 500;
        scene.add(pointLightTop);
        
        //point light buttom
        pointLightButtom = new THREE.PointLight(pointColor);
        pointLightButtom.position.copy(sun.position);
        pointLightButtom.position.x -= 0;
        pointLightButtom.position.y -= 8;
        pointLightButtom.position.z -= 0;
        pointLightButtom.distance = 500;
        scene.add(pointLightButtom);
*/       
        // Add an AmbientLight to the scene
        ambientColor = "#222222"
        ambientLight = new AmbientLight(ambientColor);
        scene.add(ambientLight);
        console.log("Added an Ambient Light to Scene");
        
        //spotlight point to the sun
        var pointColor = "#b15151";
        var spotLight = new THREE.SpotLight(pointColor);
        spotLight.position.set(0, 20, -30);
        spotLight.castShadow = false;
        spotLight.shadowCameraNear = 2;
        spotLight.shadowCameraFar = 200;
        spotLight.shadowCameraFov = 30;
        spotLight.target = sun;
        spotLight.distance = 0;
        spotLight.angle = 0.4;

        scene.add(spotLight);
        
        //spotlight point to the sun
        var pointColor2 = "#ffffff";
        var spotLight2 = new THREE.SpotLight(pointColor2);
        spotLight2.position.set(0, 20, -30);
        spotLight2.castShadow = false;
        spotLight2.shadowCameraNear = 2;
        spotLight2.shadowCameraFar = 200;
        spotLight2.shadowCameraFov = 30;
        spotLight2.target = sun;
        spotLight2.distance = 0;
        spotLight2.angle = 0.4;

        scene.add(spotLight2);
        
        // Add a SpotLight to the scene
        /*spotLight = new SpotLight(0xffffff);
        //spotLight.position.set(5.6, 23.1, 5.4);
        spotLight.position.set(0, 7.5, -10);
        spotLight.rotation.set(-0.8, 42.7, 19.5);
        spotLight.intensity = 2;
        spotLight.angle = 60 * (Math.PI / 180);
        spotLight.distance = 200;
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 1;
        spotLight.shadowMapHeight = 2048;
        spotLight.shadowMapWidth = 2048;
        //scene.add(spotLight);*/
        console.log("Added a SpotLight Light to Scene");
    
         //lensflare
        /*var textureFlare0 = THREE.ImageUtils.loadTexture("../../textures/lensflare0.png");
        var flareColor = new THREE.Color(0xffaacc);
        var lensFlare = new THREE.LensFlare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);
        lensFlare.position.copy(spotLight.position);
        scene.add(lensFlare);*/
        
        var textureFlare1 = new THREE.TextureLoader();
        textureFlare1.load(
            //resource URL
            "../../textures/lensflare0_alpha.png",
            //get the texture and deal with it
            function(texture){
                var flareColor = new THREE.Color(0xffaacc);
                var lensFlare = new THREE.LensFlare(texture, 350, 0.0, THREE.AdditiveBlending, flareColor);
                lensFlare.position.copy(spotLight.position);
                scene.add(lensFlare);
            }
        );
        
        //Add controls on the screen
        var controls = new function(){
            this.ambientColor = ambientColor; //default color 
            this.horizontal = 0.6;
            this.vertical = 16;
            this.moveCamera = false;
        }
        
        gui = new GUI();
        gui.addColor(controls, 'ambientColor').onChange(function (e){
            ambientLight.color = new THREE.Color(e);
        });
        
        gui.add(controls, 'horizontal', -10, 10).onChange(function (e) {
            camera.position.x = e;
        });
        
        gui.add(controls, 'vertical', 11, 21).onChange(function (e) {
            camera.position.y = e;
        });
        
        gui.add(controls, 'moveCamera' ).onChange( function (e){
            moveCamera = e;
            if(!moveCamera){
                console.log("stop moving the camera");
            }else{
                console.log("start moving the camera");
            }
            
        })
                
        // Add framerate stats
        addStatsObject();
        console.log("Added Stats to scene...");

        document.body.appendChild(renderer.domElement);
        gameLoop(); // render the scene	

    }//the end of init() function


    /**Global variable  */
    
    //for the earth
    rotationSpeed = 0.05;
    var a = 15;
    var b = 13;
    var alpha = 0;
    var speed = 0.001;
    var x = 0;
    var y = 0;
    
    function orbit(a:number, b:number, alpha:number, speed:number){
         x = a * Math.cos(alpha%360);
         y = b * Math.sin(alpha%360);
         alpha +=speed;
    }
    
    //for the moon
    var r = 3;
    var alpha2 = 0;
    var speed2 = 0.0365;
    
    //for mars
    var a3 = 18;
    var b3 = 16;
    var alpha3 = 0;
    var speed3 = 0.003;
    
    //for venus
    var a4 = 10;
    var b4 = 8;
    var alpha4 = 0;
    var speed4 = 0.002;
    
    // Setup main game loop
    function gameLoop(): void {
        
        stats.update();
        var delta: number = clock.getDelta();
        
        //firstPersonControls.update(delta);
        
        earth.rotation.y += rotationSpeed;
        earth.position.x = a * Math.cos(alpha%360) - 3;
        earth.position.z = b * Math.sin(alpha%360);
        alpha += speed;

        moon.position.copy(earth.position);
        moon.position.x += r * Math.cos(alpha2%360);
        moon.position.z += r * Math.sin(alpha2%360);
        alpha2 +=speed2;
        
        //mars.rotation.y += rotationSpeed;
        mars.position.x = a3 * Math.cos(alpha3%360) - 3;
        mars.position.z = b3 * Math.sin(alpha3%360);
        alpha3 += speed3;
        
        //venus.rotation.y += rotationSpeed;
        venus.position.x = a4 * Math.cos(alpha4%360) - 3;
        venus.position.z = b4 * Math.sin(alpha4%360);
        alpha4 += speed4;
        
        moveCameracontrol();
    
        // render using requestAnimationFrame
        requestAnimationFrame(gameLoop);
        // render the scene
        renderer.render(scene, camera);
    }

    // Setup default renderer
    function setupRenderer(): void {
        renderer = new Renderer({antialias:false, alpha:true});
        renderer.setClearColor(0x000000, 1.0);
        //renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = false;
        console.log("Finished setting up Renderer...");
    }

    // Setup main camera for the scene
    function setupCamera(): void {
        //camera = new PerspectiveCamera(45, config.Screen.RATIO, 0.1, 1000);
        camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 0;
        camera.position.y = 16;
        camera.position.z = -20.5;
        camera.lookAt(new Vector3(0, 0, 0));
        console.log("Finished setting up Camera...");
    }
    
    var moveDirection = 1; //move to left when > 0; move to right when < 0
    var rCamera = 3;
    var delta = 0;
    var moveStep = 0.01;
    
    function moveCameracontrol(): void {
        
        if(moveCamera){
            
            camera.position.x = rCamera * Math.cos(delta%360);
            camera.position.y = 16 + rCamera * Math.sin(delta%360);
           
            delta += moveStep;
            
            /*if(moveDirection > 0){
                camera.position.x += moveStep;
                if(camera.position.x > 10 )
                    moveDirection = - moveDirection;
            }else {
                camera.position.x -= moveStep;
                if(camera.position.x < - 10)
                    moveDirection = - moveDirection;
            }*/
        }
    }
    
    //Zoom in/out scene
    document.body.addEventListener( 'mousewheel', mousewheel, false );
    document.body.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

    function mousewheel( e ) {      
        var d = ((typeof e.wheelDelta != "undefined")?(-e.wheelDelta):e.detail);
        d = 5 * ((d>0)?1:-1);

        var cPos = camera.position;
        if (isNaN(cPos.x) || isNaN(cPos.y) || isNaN(cPos.y))
        return;

        var r = cPos.x*cPos.x + cPos.y*cPos.y;
        var sqr = Math.sqrt(r);
        var sqrZ = Math.sqrt(cPos.z*cPos.z + r);


        var nx = cPos.x + ((r==0)?0:(d * cPos.x/sqr));
        //var nx = cPos.x
        
        var ny = cPos.y + ((r==0)?0:(d * cPos.y/sqr));
        //var ny = cPos.y;
        
        var nz = cPos.z + ((sqrZ==0)?0:(d * cPos.z/sqrZ));
        //var nz = cPos.z;
        
        if (isNaN(nx) || isNaN(ny) || isNaN(nz))
            return;

        cPos.x = nx;
        cPos.y = ny;
        cPos.z = nz;
    }

    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }
    
    window.onload = init;

    return {
        scene: scene
    }

})();

