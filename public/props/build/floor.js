    
function floor(x, y, z) {
    const loader = new THREE.TextureLoader();
    // Создание пола
    const floorTexture = loader.load('img/wood.jpg');

    const floorGeometry = new THREE.PlaneGeometry(4, 4);
    var normalMap = THREE.ImageUtils.loadTexture ('img/wood_normal.png');
    const floorMaterial = new THREE.MeshPhongMaterial({map: floorTexture, normalMap: normalMap});
    // floorMaterial.normalScale.set(0.02, 0.02);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(x, y, z)
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = true; // Включение отбрасывания теней для столбика
    floor.receiveShadow = true; // Включение принятия теней для столбика
    scene.add(floor);

    // Создание материала для пола с упругостью
    const floorMat = new CANNON.Material('floorMaterial');
    floorMat.restitution = 0.72;
    // Создание формы и тела для пола
    const floorShape = new CANNON.Box(new CANNON.Vec3(2, 0.1, 2));
    const floorBody = new CANNON.Body({mass: 0});
    floorBody.addShape(floorShape);
    floorBody.position.set(x, y, z);
    floorBody.material = floorMat; // Применение материала к телу пола
    world.addBody(floorBody);
}
