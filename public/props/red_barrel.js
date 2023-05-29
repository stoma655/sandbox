    
function redBarrel_prop(x, y, z) {
    const modelLoader = new THREE.GLTFLoader();
    // бочка красная red barrel 
    modelLoader.load('models/red_barrel/half_life_inspired_explosive_barrel.glb', (gltf) => {
        red_barrel = gltf.scene;
        // Применение текстуры к материалу модели
        // red_barrel.traverse(object => {
        //     if (object.isMesh) {
        //         object.material.emissive.set(0x111111);
        //     }
        // });
        // Изменение позиции и масштаба модели
        red_barrel.position.set(-2, 0.8, -1.3);
        red_barrel.scale.set(0.02, 0.02, 0.02);
            // Установка свойств castShadow и receiveShadow для всех дочерних объектов
    red_barrel.traverse((child) => {
        child.castShadow = true;
        // child.receiveShadow = true;
    });
        // red_barrel.rotateY(143)
        const angle = THREE.MathUtils.degToRad(145); // Угол поворота в радианах
        red_barrel.rotateX(angle); // Поворот модели бочки вокруг оси Y на 45 градусов
        red_barrels.push(red_barrel)
        scene.add(red_barrel);
    });

    // Создание формы и тела для цилиндра
    const cylinderShape = new CANNON.Cylinder(0.4, 0.4, 1.3, 18); // Создание формы цилиндра с радиусом верхнего и нижнего оснований 1, высотой 2 и 32 сегментами
    cylinderBody = new CANNON.Body({mass: 1}); // Создание тела с массой 1
    cylinderBody.addShape(cylinderShape); // Добавление формы к телу
    cylinderBody.position.set(1, 1, 1); // Установка позиции тела на позицию визуального объекта
    cylinderBodys.push(cylinderBody);
    world.addBody(cylinderBody); // Добавление тела в физический мир
}
     
