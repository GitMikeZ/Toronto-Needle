  var scene = new THREE.Scene();
  var materials = [], parameters, i, color, sprite, size;
  scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );

    // SETUP RENDERER

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000 );                // white background colour
  document.body.appendChild( renderer.domElement );  // add to document canvas

   // SETUP CAMERA

  var aspect = window.innerWidth/window.innerHeight;
  camera = new THREE.PerspectiveCamera( 30, aspect, 0.1, 10000);   // view angle, aspect ratio, near, far
  camera.position.set(10,15,40);
  camera.lookAt(scene.position);
  scene.add(camera);

    // DEFINE UNIT CUBE -- to be reused several times

  var unitCubeGeometry = new THREE.BoxGeometry( 1,1,1 );

    // SCENE AXES:    (x,y,z) drawn in (red,greeen,blue)

  var redMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  var greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var blueMaterial  = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
  var yellowMaterial  = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

  var xAxis = new THREE.Mesh( unitCubeGeometry, redMaterial );
  var yAxis = new THREE.Mesh( unitCubeGeometry, greenMaterial );
  var zAxis = new THREE.Mesh( unitCubeGeometry, blueMaterial );
  var axisWidth = 0.2;
  var axisLength = 10;
 // scene.add( xAxis );   xAxis.scale.set(axisLength,axisWidth,axisWidth); xAxis.position.set(0.5*axisLength,0,0);
 // scene.add( yAxis );   yAxis.scale.set(axisWidth,axisLength,axisWidth); yAxis.position.set(0,0.5*axisLength,0);
 // scene.add( zAxis );   zAxis.scale.set(axisWidth,axisWidth,axisLength); zAxis.position.set(0,0,0.5*axisLength);
  var originBox = new THREE.Mesh( unitCubeGeometry, yellowMaterial );
 // scene.add( originBox );
  xAxis.parent = yAxis.parent = zAxis.parent;// = originBox;

    // FLOOR WITH CHECKERBOARD

  var floorTexture = new THREE.ImageUtils.loadTexture( 'images/snow.jpg' );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set( 1, 1 );
  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  var floorGeometry = new THREE.PlaneGeometry(30, 30);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -5;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
  floor.parent = originBox;

      // LIGHTS:  needed for phong illumination model
      // The following will be used by (1) three.js; and (2) your own shaders, passed via uniforms

  lightColor = new THREE.Color(1,1,1);
  ambientColor = new THREE.Color(1,1,1);
  lightPosition = new THREE.Vector3(-70,100,70);

/////////////////////////// THREE.JS ILLUMINATION ////////////////////////////

    // LIGHT SOURCES

  var light = new THREE.PointLight(lightColor.getHex());
  light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
  scene.add(light);
  var ambientLight = new THREE.AmbientLight(ambientColor.getHex());
  scene.add(ambientLight);

    // DEFAULT PHONG MATERIAL  (used by the car + statue)

  var defaultPhongMaterial = new THREE.MeshPhongMaterial( {
       ambient: 0x838B8B, color: 0x838B8B, specular: 0x838B8B, shininess: 100.0});



/////////////////////////// MY SHADERS ////////////////////////////

  kAmbient = new THREE.Color(0x404040);    // ambient reflectance
  kDiffuse = new THREE.Color(0x808080);    // diffuse reflectance
  kSpecular = new THREE.Color(0x808080);   // specular reflectance (purposely 4x larger)
  k0 = new THREE.Color(0x000000);          // use when we want to assign zero reflectance
  shininess = 10.0;                        // Phong shininess (purposely 4x smaller)

    // ALL

  var phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
      lightColor: {type: "c", value: lightColor },
      ambientColor: {type: "c", value: ambientColor },
      lightPosition: {type: "v3", value: lightPosition },
      nSpec: {type: "f", value: shininess },
      ka: {type: "c", value: kAmbient },
      kd: {type: "c", value: kDiffuse },
      ks: {type: "c", value: kSpecular }
    },
    vertexShader: document.getElementById('vertexShader').text,
    fragmentShader: document.getElementById('myPhong').text
  });

  // var mySphere4Geometry = new THREE.SphereGeometry( 2, 32, 32 );
  //var mySphere4 = new THREE.Mesh( mySphere4Geometry, mySphere4Material );
  //scene.add( mySphere4 );
  //mySphere4.position.set(6,1,5);
  //mySphere4.parent = originBox;

  // STATUE + CAR:  meshes laoded from OBJ files

 loadOBJ( 'obj/Toronto Needle.obj', .5, 0, -4.5, 0,0,0,0);


	var geometry = new THREE.Geometry();

	var sprite1 = THREE.ImageUtils.loadTexture( 'images/snowflake1.jpg' );
	var sprite2 = THREE.ImageUtils.loadTexture( 'images/snowflake2.jpg' );
	var sprite3 = THREE.ImageUtils.loadTexture( 'images/snowflake3.jpg' );
	var sprite4 = THREE.ImageUtils.loadTexture( 'images/snowflake4.jpg' );
	var sprite5 = THREE.ImageUtils.loadTexture( 'images/snowflake5.jpg' );


	for ( i = 0; i < 10000; i ++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 200 - 100;
		vertex.y = Math.random() * 200 - 100;
		vertex.z = Math.random() * 200 - 100;

		geometry.vertices.push( vertex );

	}

	var	parameters = [ [ [0, 0, 0], sprite2, 20 ],
					   [ [0.1, 0.1, 0.1], sprite3, 15 ],
					   [ [0.2, 0.2, 0.2], sprite1, 10 ],
					   [ [0.3, 0, 0.3], sprite5, 8 ],
					   [ [0.4, 0, 0.5], sprite4, 5 ],
					   ];

	for ( i = 0; i < parameters.length; i ++ ) {

		color  = parameters[i][0];
		sprite = parameters[i][1];
		size   = parameters[i][2];

		materials[i] = new THREE.PointCloudMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
		materials[i].color.setHSL( color[0], color[1], color[2] );

		particles = new THREE.PointCloud( geometry, materials[i] );

		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;

		scene.add( particles );

	}

    // SETUP RENDER CALL-BACK

  var render = function () {
    requestAnimationFrame( render );
	particles.rotation.z -= 0.004;

    renderer.render(scene, camera);
  };

  function animate() {
	render();
}

animate();


