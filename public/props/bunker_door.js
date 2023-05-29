function bunker_door(x, y, z) {
    const modelLoader = new THREE.GLTFLoader();
    modelLoader.load('models/bunker_door/bunker_door.glb', (gltf) => {
      red_barrel = gltf.scene;
  
      // Изменение позиции и масштаба модели
      red_barrel.position.set(x, y, z);
      red_barrel.rotateY(90 * Math.PI / 180);
      red_barrel.scale.set(1.70, 1.70, 1.70);
    //   red_barrel.rotateY(-90 * Math.PI / 180);
      // Установка свойств castShadow и receiveShadow для всех дочерних объектов
      red_barrel.traverse((child) => {
        // child.castShadow = true;
        // child.receiveShadow = true;
      });
      scene.add(red_barrel);
  
    //   mixer = new THREE.AnimationMixer(red_barrel);
    //   gltf.animations.forEach((animation) => {
    //     const animationAction = mixer.clipAction(animation);
    //     animationAction.play();
    //     setTimeout(() => {
    //       animationAction.paused = true;
    //     }, 1200);
    //   });
    });
  
  

  // Создание AnimationMixer и добавление анимаций из gltf.animations


    
    // Создание формы и тела для цилиндра
    const cylinderShape = new CANNON.Cylinder(0.4, 0.4, 1.3, 18); // Создание формы цилиндра с радиусом верхнего и нижнего оснований 1, высотой 2 и 32 сегментами
    cylinderBody = new CANNON.Body({mass: 1}); // Создание тела с массой 1
    cylinderBody.addShape(cylinderShape); // Добавление формы к телу
    cylinderBody.position.set(1, 1, 1); // Установка позиции тела на позицию визуального объекта
    world.addBody(cylinderBody); // Добавление тела в физический мир
}
     