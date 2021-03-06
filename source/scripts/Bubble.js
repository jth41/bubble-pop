(function ()
{

    "use strict";

    var mouse = new THREE.Vector2();
    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    //var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 100 );
    var scene = new THREE.Scene();

    var columns = 9;
    var rows = 9;
    var score = 0;


    Array.matrix = function (m, n, initial)
    {
        var a, i, j, mat = [];
        for (i = 0; i < m; i += 1)
        {
            a = [];
            for (j = 0; j < n; j += 1)
            {
                a[j] = initial;
            }
            mat[i] = a;
        }
        return mat;
    };

    var board = Array.matrix(columns, rows, 0);

    board.columns = function ()
    {
        return this.length;
    };

    board.rows = function ()
    {
        return this[0].length;
    };

    function init()
    {

        // initialize object to perform world/screen calculations
        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight - 20);
        renderer.shadowMapEnabled = true;

        // // Load the background texture
        // var texture = THREE.ImageUtils.loadTexture( 'stars.jpg' );
        // var backgroundMesh = new THREE.Mesh(
        //     new THREE.PlaneGeometry(2, 2, 0),
        //     new THREE.MeshBasicMaterial({
        //         map: texture
        //     }));
        // backgroundMesh .material.depthTest = false;
        // backgroundMesh .material.depthWrite = false;
        // scene.add(backgroundMesh);

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
        var scoreText = document.getElementById('score');

        // call the render function
        renderer.render(scene, camera);

        document.addEventListener('mousedown', onDocumentMouseDown, false);

        //animateScene(); 
    }

    window.onload = init;

    // once everything is loaded, we run our Three.js stuff.
    function animateScene()
    {
        // At first, we increase the y rotation of the triangle mesh and decrease the x 
        // rotation of the square mesh. 


        for (var column = 0; column < board.columns() ; column++)
        {
            for (var row = 0; row < board.rows() ; row++)
            {
                if (board[column][row] != null)
                {
                    // Increase the y rotation of the triangle 
                    board[column][row].rotation.y += 0.1;

                    // Decrease the x rotation of the square 
                    board[column][row].rotation.x -= 0.075;
                };
            };
        };

        // Define the function, which is called by the browser supported timer loop. If the 
        // browser tab is not visible, the animation is paused. So 'animateScene()' is called 
        // in a browser controlled loop. 
        setTimeout
        (
            function ()
            {
                requestAnimationFrame(animateScene);
            }, 1000 / 10
        );

        // Map the 3D scene down to the 2D screen (render the frame) 
        renderer.render(scene, camera);
    }

    function fallingAnimation(cubesToAnimate)
    {
        for (var count = 0; count <= cubesToAnimate.length - 1; count++)
        {
            if (cubesToAnimate[count] != null)
            {
                cubesToAnimate[count].position.y -= 1;
            };
        };

        // Map the 3D scene down to the 2D screen (render the frame) 
        renderer.render(scene, camera);
    }

    function addCubes()
    {
        var cubeColors = ["rgb(255,0,0)", "rgb(255,255,0)", "rgb(255,0,255)",
            "rgb(0,255,0)", "rgb(255,125,0)", "rgb(0,125,255)"
        ];

        for (var column = 0; column < board.columns() ; column++)
        {
            for (var row = 0; row < board.rows() ; row++)
            {

                var colorChoice = cubeColors[Math.floor(Math.random() * cubeColors.length)];

                // create a cube
                //var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
                var cubeGeometry = new THREE.SphereGeometry(2.3, 20, 20);

                var cubeMaterial = new THREE.MeshLambertMaterial({
                    color: colorChoice
                });
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                // position the cube
                cube.position.x = (5 * column) - 11;
                cube.position.y = (5 * row);
                cube.position.z = 0;
                cube.IsPopped = false;
                cube.Identifier = column + "" + row;
                cube.column = column;
                cube.row = row;
                cube.color = colorChoice;

                board[column][row] = cube;

                // add the cube to the scene
                scene.add(cube);
            }
        }
    }

    function onDocumentMouseDown(event)
    {

        var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        vector = vector.unproject(camera);

        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0)
        {

            //find all alike neighbors
            var neighbors = findNeighbors(intersects[0].object, [intersects[0].object]);

            console.log(intersects[0].object.column + "" + intersects[0].object.row + " Clicked");


            if (neighbors.length < 2)
            {
                return;
            }



            for (var i = 0; i < neighbors.length; i++)
            {
                neighbors[i].IsPopped = true;
                neighbors[i].material = new THREE.MeshLambertMaterial({ color: 0xffffff });
            }
            renderer.render(scene, camera);


            shift()

            for (var neighborCount = 0; neighborCount < neighbors.length; neighborCount++)
            {
                scene.remove(neighbors[neighborCount]);
            }


            score = score + (2 * neighbors.length);
            document.getElementById('score').innerHTML = 'Score: ' + score;
            renderer.render(scene, camera);

            //search for any possible moves left
            // if(!areMovesLeft())
            // {
            //     alert("Happy Anniversary Plakiakimou! your loving husband, John");
            // }
        }
    }

    function undo()
    {
        alert("undo!");
    }

    function areMovesLeft()
    {
        for (var column = 0; column < board.columns() ; column++)
        {
            for (var row = 0; row < board.rows() ; row++)
            {
                var found;
                if (board[column][row] != null)
                {
                    found = findNeighbors(board[column][row], [board[column][row]]);
                }

                if (found.length > 1)
                {
                    return true;
                }
            }
        }

        return false;
    }

    function shift()
    {
        for (var column = board.columns() - 1; column >= 0; column--)
        {
            for (var row = board.rows() - 1; row >= 0; row--)
            {
                if (board[column][row] != null && board[column][row].IsPopped == true)
                {
                    scene.remove(board[column][row]);
                    //move all cubes above this cube down 1
                    var cubesToMoveDown = CubesAbove(board[column][row]);
                    MoveCubesDown(cubesToMoveDown);
                };
            };


        };

        for (var x = board.columns() - 1; x >= 0; x--)
        {
            for (var column = board.columns() - 1; column >= 0; column--)
            {
                //if all cubes in column are popped
                if (AllCubesInColumnArePopped(column))
                {
                    //move all columns on the left, to the right.
                    var startingColumn = column;
                    for (var columnIndex = startingColumn - 1; columnIndex >= 0; columnIndex--)
                    {
                        MoveCubesOver(board[columnIndex]);
                    }
                };

            };
        }
    }

    function AllCubesInColumnArePopped(column)
    {
        for (var row = board.rows() - 1; row >= 0; row--)
        {
            if (board[column][row] != null && board[column][row].IsPopped != true)
            {
                return false
            }
        }

        return true;
    }

    function AllCubesInColumnAreNull(column)
    {
        for (var row = board.rows() - 1; row >= 0; row--)
        {
            if (board[column][row] != null)
            {
                return false
            }
        }

        return true;
    }

    function CubesAbove(cube)
    {
        var listOfCubes = [];

        var startingRow = cube.row;

        for (var row = startingRow + 1; row < board.rows() ; row++)
        {
            if (board[cube.column][row] != null)
            {
                listOfCubes.push(board[cube.column][row]);
            }
        };

        return listOfCubes;
    }


    function MoveCubesDown(cubes)
    {


        for (var i = 0; i <= cubes.length - 1; i++)
        {


            var cubeToMove = cubes[i];

            //move cube down one in board
            board[cubeToMove.column][cubeToMove.row - 1] = cubeToMove;

            //remove what was this cube
            board[cubeToMove.column][cubeToMove.row] = null;

            //move cube row identifier down one
            cubeToMove.row = cubeToMove.row - 1;

            //cubeToMove.position.y = cubeToMove.position.y -5;

        };


        for (var i = 4; i >= 0; i--)
        {
            setTimeout(fallingAnimation(cubes), 1000);
            //fallingAnimation(cubes);
            renderer.render(scene, camera);
        };

    }

    function MoveCubesOver(cubes)
    {
        for (var i = 0; i <= cubes.length - 1; i++)
        {

            if (cubes[i] != null)
            {
                var cubeToMove = cubes[i];

                //move cube down one in board
                board[cubeToMove.column + 1][cubeToMove.row] = cubeToMove;

                //remove what was this cube
                board[cubeToMove.column][cubeToMove.row] = null;

                //move cube row identifier down one
                cubeToMove.column = cubeToMove.column + 1;

                cubeToMove.position.x = cubeToMove.position.x + 5;
                renderer.render(scene, camera);
            }
        };
    }

    function findNeighbors(cube, alreadyFoundNeighbors)
    {
        alreadyFoundNeighbors.contains = function (obj)
        {
            for (var i = 0; i < this.length; i++)
            {
                if (this[i] === obj)
                {
                    return true;
                }
            }
            return false;
        };


        //no more room to the left
        if (cube.column !== 0 && board[cube.column - 1][cube.row] != null)
        {
            var left = board[cube.column - 1][cube.row];

            if (left.color === cube.color && !alreadyFoundNeighbors.contains(left))
            {
                alreadyFoundNeighbors.push(left);
                alreadyFoundNeighbors = findNeighbors(left, alreadyFoundNeighbors);
            }
        }

        //no more room to the right
        if (cube.column !== board.columns() - 1 && board[cube.column + 1][cube.row] != null)
        {
            var right = board[cube.column + 1][cube.row];

            if (right.color === cube.color && !alreadyFoundNeighbors.contains(right))
            {
                alreadyFoundNeighbors.push(right);
                alreadyFoundNeighbors = findNeighbors(right, alreadyFoundNeighbors);
            }
        }


        //no more room below
        if (cube.row !== 0 && board[cube.column][cube.row - 1] != null)
        {
            var below = board[cube.column][cube.row - 1];

            if (below.color === cube.color && !alreadyFoundNeighbors.contains(below))
            {
                alreadyFoundNeighbors.push(below);
                alreadyFoundNeighbors = findNeighbors(below, alreadyFoundNeighbors);
            }
        }

        //no more room above
        if (cube.row !== board.rows() - 1 && board[cube.column][cube.row + 1] != null)
        {
            var above = board[cube.column][cube.row + 1];

            if (above.color === cube.color && !alreadyFoundNeighbors.contains(above))
            {
                alreadyFoundNeighbors.push(above);
                alreadyFoundNeighbors = findNeighbors(above, alreadyFoundNeighbors);
            }
        }

        return alreadyFoundNeighbors;

        //if y is same but x is +1 or -1 then isNeighbor
        //if x is same but y is +1 or -1 then isNeighbor
        //if isNeighbor then if alreadyFoundNeighbor doesn't already contain cube then add cube
    }


})();
