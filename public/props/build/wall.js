function wall_build_prop(x, y, z, geometry) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./img/wall.png');
    var normalMap = THREE.ImageUtils.loadTexture ('./img/wall_normal.png');
    let wallGeometry = 1;
    let wall1Shape = 1;

    if (geometry == 1) {
        wallGeometry = new THREE.BoxGeometry(0.3, 4, 4);
        wall1Shape = new CANNON.Box(new CANNON.Vec3(0.15, 2, 2));
    }
    if (geometry == 2) {
        wallGeometry = new THREE.BoxGeometry(4, 4, 0.3);
        wall1Shape = new CANNON.Box(new CANNON.Vec3(2, 2, 0.15));
    }
    
    const wallMaterial = new THREE.MeshPhongMaterial({map: texture, normalMap: normalMap, shininess: 100});
    wallMaterial.normalScale.set(0.5, 0.5);

    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.x = x;
    wall1.position.y = y;
    wall1.position.z = z;
    
    // wall1.rotation.x = Math.PI / 2;
    wall1.castShadow = true; // Включение отбрасывания теней для столбика
    // wall1.receiveShadow = true; // Включение принятия теней для столбика
    scene.add(wall1);

    // Создание формы и тела для стены 1
    
    const wall1Body = new CANNON.Body({mass: 0});
    wall1Body.addShape(wall1Shape);
    wall1Body.position.set(wall1.position.x, wall1.position.y, wall1.position.z);
    world.addBody(wall1Body);
}