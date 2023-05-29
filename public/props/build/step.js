function step(x, y, z) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./img/step.png');
    var normalMap = THREE.ImageUtils.loadTexture ('./img/step_normal.png');

    const stepWidth = 0.4;
    const stepHeight = 0.4;
    const stepDepth = 4;
    
    // Создание ступеньки лестницы в Three.js
    const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
    const stepMaterial = new THREE.MeshPhongMaterial({ map: texture, normalMap: normalMap, shininess: 100 });
    const stepMesh = new THREE.Mesh(stepGeometry, stepMaterial);
    
    // Установка позиции ступеньки
    stepMesh.position.set(x, y, z);
    scene.add(stepMesh)
    
    // Создание физической модели ступеньки в Cannon.js
    const stepShape = new CANNON.Box(new CANNON.Vec3(stepWidth / 2, stepHeight / 2, stepDepth / 2));
    const stepBody = new CANNON.Body({ mass: 0 }); // mass = 0 делает тело статическим
    stepBody.addShape(stepShape);
    
    // Установка позиции физической модели
    stepBody.position.copy(stepMesh.position);
    
    // Добавление физической модели в мир Cannon.js
    world.addBody(stepBody);
}
