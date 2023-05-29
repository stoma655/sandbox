function supply_box_prop(x, y, z) {
    const loader = new THREE.TextureLoader();
    const boxTexture = loader.load('img/box.png');
    var normalMap = THREE.ImageUtils.loadTexture ('./img/supply_normal.png');
    // коробка
    const boxGeometry = new THREE.BoxGeometry(1, 0.5, 1);
    const boxMaterial = new THREE.MeshPhongMaterial({map: boxTexture});
    let box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(x, y, z);
    box.castShadow = true;
    box.receiveShadow = true;
    supply_boxes.push(box)
    scene.add(box);


    
    // Создание формы и тела для коробки
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 0.5));
    var boxBody = new CANNON.Body({mass: 0.4});
    boxBody.addShape(boxShape);
    boxBody.position.set(x, y, z);

// // Создание материала для коробки с большим трением
// const boxCannonMaterial = new CANNON.Material({friction: 1});
// boxBody.material = boxCannonMaterial;

// // Установка трения по умолчанию для всех пар материалов в мире
// world.defaultContactMaterial.friction = 1;

    supply_boxesBodys.push(boxBody)
    world.addBody(boxBody);
};