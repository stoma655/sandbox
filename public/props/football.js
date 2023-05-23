function football_prop(x, y, z) {
    const loader = new THREE.TextureLoader();
    const footballTexture = loader.load('img/basketball.png');
        // футбольный мяч 
    // мяч
    const footballGeometry = new THREE.SphereGeometry(0.25, 22, 22);
    const footballMaterial = new THREE.MeshLambertMaterial({map: footballTexture});
    football = new THREE.Mesh(footballGeometry, footballMaterial);
    football.position.set(x, y, z);
    football.castShadow = true;
    football.receiveShadow = true;
    footballs.push(football)
    scene.add(football);

    // Создание материала с высокой упругостью МЯЧ 
    const bouncyMaterial = new CANNON.Material('bouncyMaterial');
    bouncyMaterial.restitution = 0.98;
    bouncyMaterial.friction = 2.5;
    // Создание формы и тела для сферы
    const sphereShape = new CANNON.Sphere(0.2);
    sphereBody = new CANNON.Body({mass: 0.8});
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(x, y, z);
    sphereBody.material = bouncyMaterial; // Применение материала к телу сферы
    footballsBodys.push(sphereBody)
    world.addBody(sphereBody);

}