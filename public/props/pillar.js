function pillar_prop(x, y, z) {
    // Создание столбика
    const pillarGeometry = new THREE.BoxGeometry(0.2, 4, 0.2);
    const pillarMaterial = new THREE.MeshPhongMaterial({color: 0x808080});
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar.position.y = y; // Установка позиции столбика по вертикали
    pillar.position.x = x; // Установка позиции столбика по вертикали
    pillar.position.z = z; // Установка позиции столбика по вертикали
    pillar.castShadow = true; // Включение отбрасывания теней для столбика
    pillar.receiveShadow = true; // Включение принятия теней для столбика
    scene.add(pillar);

}
