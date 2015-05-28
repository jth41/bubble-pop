//bubble.js

"use strict"

	    // once everything is loaded, we run our Three.js stuff.
    function init() 
    {

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        var scene = new THREE.Scene();

        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        // create a render and set the size
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;

        // create the ground plane
        //var planeGeometry = new THREE.PlaneGeometry(60, 20);
        //var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        //var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        //plane.receiveShadow = true;

        // rotate and position the plane
        //plane.rotation.x = -0.5 * Math.PI;
        //plane.position.x = 15;
        //plane.position.y = 0;
        //plane.position.z = 0;

        // add the plane to the scene
        //scene.add(plane);

        addCubes(scene);


        // position and point the camera to the center of the scene
        camera.position.x = 13;
        camera.position.y = 20;
        camera.position.z = 90;
        //camera.lookAt(scene.position);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(20, 80, 91);
        
        scene.add(spotLight);

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        // call the render function
        renderer.render(scene, camera);
    }

    function addCubes (scene)
    {
        for (var i = 0 ; i < 10; i++)
        {
            for (var j = 0 ; j < 10; j++)
            {
                // create a cube
                var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

                var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff });
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                // position the cube
                cube.position.x = (5 * j) -11;
                cube.position.y = (5 * i);
                cube.position.z = 0;

                // add the cube to the scene
                scene.add(cube);
            };
        };
    }

 window.onload = init;