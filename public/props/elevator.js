function elevator(x, y, z) {
    const modelLoader = new THREE.GLTFLoader();
    modelLoader.load('models/elevator/elevator.glb', (gltf) => {
      red_barrel = gltf.scene;
  
      // Изменение позиции и масштаба модели
      red_barrel.position.set(x, y, z);
      red_barrel.rotateY(-90 * Math.PI / 180);
      red_barrel.scale.set(0.32, 0.32, 0.32);
      // Установка свойств castShadow и receiveShadow для всех дочерних объектов
      red_barrel.traverse((child) => {
        // child.castShadow = true;
        // child.receiveShadow = true;
      });
      scene.add(red_barrel);
  
      mixer = new THREE.AnimationMixer(red_barrel);
      gltf.animations.forEach((animation) => {
        const animationAction = mixer.clipAction(animation);
        animationAction.play();
        setTimeout(() => {
          animationAction.paused = true;
        }, 1000);
      });
    });
  
  

  // Создание AnimationMixer и добавление анимаций из gltf.animations


        // Создание материала для стенок лифта с упругостью
        const wallMaterial = new CANNON.Material();
        wallMaterial.restitution = 0.1;
        wallMaterial.friction = 2.5;

        // Создание форм для стенок лифта
        const wallShape = new CANNON.Box(new CANNON.Vec3(1, 1.5, 0.1));
        const wallShape2 = new CANNON.Box(new CANNON.Vec3(0.1, 1.5, 1));
        const ceilingShape = new CANNON.Box(new CANNON.Vec3(1, 0.1, 1));
        const floorShape = new CANNON.Box(new CANNON.Vec3(1, 0.1, 1));

        // Создание составного тела для лифта
        elevatorBody = new CANNON.Body({mass: 0});
        elevatorBody.addShape(wallShape, new CANNON.Vec3(0, 1.5, -1));
        elevatorBody.addShape(wallShape, new CANNON.Vec3(0, 1.5, 1));
        elevatorBody.addShape(wallShape2, new CANNON.Vec3(-1, 1.5, 0));
        elevatorBody.addShape(ceilingShape, new CANNON.Vec3(0, 3, 0));
        elevatorBody.addShape(floorShape);
        elevatorBody.material = wallMaterial;
        elevatorBody.fixedRotation = false; // Разрешение вращения тела
        elevatorBody.position.set(x,y,z)
        world.addBody(elevatorBody);
}
     