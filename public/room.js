THREE.ShaderChunk.shadowmap_pars_fragment = THREE.ShaderChunk.shadowmap_pars_fragment.replace( 'return shadow;', 'return max( 0.5, shadow );' );

let camera, scene, renderer;
let controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();

let cameraBody

let world
let cannonDebugRenderer


let velocityY = 0;
const gravity = -30;

let box
let boxBody

let football
let sphereBody


let grenade
let granadeBody


let table 
let tableBody

let explosionSprite
let explosionMaterial
const frameCount = 11; // Количество кадров в спрайте






init();
animate();
let moveFast = false;
let particleSystem;

function init() {






    // Создание мира физики
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    // Создание сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // scene.fog = new THREE.Fog(0xffffff, 10, 50);

    // Создание камеры
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 0);

    // Использование cannon-debugger для визуализации физических тел
    cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

    // Создание рендерера
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Создание контролов для передвижения
    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    // Активация PointerLockControls при клике на страницу
    document.addEventListener('click', () => {
        controls.lock();
    });

    // Обработка нажатия клавиш WASD
    

    const onKeyDown = (event) => {
     switch (event.code) {
     case 'KeyW':
     moveForward = true;
     break;
     case 'KeyA':
     moveRight = true;
     break;
     case 'KeyS':
     moveBackward = true;
     break;
     case 'KeyD':
     moveLeft = true;
     break;
     case 'ShiftLeft':
     case 'ShiftRight':
     moveFast = true;
     break;
     case 'Space':
     if (canJump) velocityY += 10; // Установить вертикальную скорость при прыжке
     canJump = false;
     break;
     }
    };
    
    const onKeyUp = (event) => {
     switch (event.code) {
     case 'KeyW':
     moveForward = false;
     break;
     case 'KeyA':
     moveRight = false;
     break;
     case 'KeyS':
     moveBackward = false;
     break;
     case 'KeyD':
     moveLeft = false;
     break;
     case 'ShiftLeft':
     case 'ShiftRight':
     moveFast = false;
     break;
     }
    };

    document.addEventListener('keydown', event => {
        if (event.code === 'KeyE') {
          // Создание луча
          const raycaster = new THREE.Raycaster();
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
          raycaster.set(camera.position, direction);
          raycaster.camera = camera; // Установка свойства camera объекта raycaster
      
          // Определение точки пересечения луча с физическими объектами
          const objects = scene.children.filter(object => object !== null); // Фильтрация массива scene.children
          const intersects = raycaster.intersectObjects(objects);
          if (intersects.length > 0) {
            const position = intersects[0].point;
            // Создание взрыва в точке пересечения
            explode(position);
          }
        }
      });
      
      


      // Установка свойства emissive в 0x000000 для всех материалов в сцене
scene.traverse(object => {
    if (object.material) {
      object.material.emissive.set(0x000000);
    }
  });

    // document.addEventListener('keydown', event => {
    //     if (event.code === 'KeyE') {
    //       // Пинок физического объекта
    //       const force = new CANNON.Vec3(4, 4, 7);
    //       const worldPoint = new CANNON.Vec3().copy(boxBody.position);
    //       boxBody.applyImpulse(force, worldPoint);
    //     }
    //   });


    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

   // cоздание и загрузка моделей 
   const modelLoader = new THREE.GLTFLoader();




    // создание текстур
    const loader = new THREE.TextureLoader();
    const texture = loader.load('img/brick.jpg');
    const floorTexture = loader.load('img/wood.jpg');
    const boxTexture = loader.load('img/box.png');
    const footballTexture = loader.load('img/basketball.png');
    const explosionTexture = loader.load('img/explosion.png');
    const sky = loader.load('img/sky.png');
    const grass = loader.load('img/grass.png');
    // пофтор текстур а не растягивание  стен
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // пофтор текстур а не растягивание пола
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;

    grass.wrapS = THREE.RepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(5, 2); // Повторить текстуру 4 раза по горизонтали и 1 раз по вертикали
    floorTexture.repeat.set(7, 7);
    grass.repeat.set(37, 37);



    // Создание источника света СОЛНЦЕ
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(18, 20, 18);
    light.castShadow = true; // Включение генерации теней для источника света
    // light.shadow.bias = -0.001; // Установка значения shadow.bias
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.radius = 23;
    scene.add(light);

    // Создание сферы для представления источника света
    const lightSphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const lightSphereMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
    lightSphere.position.copy(light.position); // Установка позиции сферы на позицию источника света
    scene.add(lightSphere);



// ТРАВА 
// Создание большого куска земли
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({map: grass});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.set(55, 0, 0);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
// Создание материала для пола с упругостью
const grassMat = new CANNON.Material('floorMaterial');
grassMat.restitution = 0.1;
grassMat.friction = 2.5;

// Создание формы и тела для пола
const grassShape = new CANNON.Box(new CANNON.Vec3(50, 0.1, 50));
const grassMatBody = new CANNON.Body({mass: 0});
grassMatBody.addShape(grassShape);
grassMatBody.position.set(55, 0, 0);
grassMatBody.material = grassMat; // Применение материала к телу пола
world.addBody(grassMatBody);






    // Создание пола
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshPhongMaterial({map: floorTexture});
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = true; // Включение отбрасывания теней для столбика
    floor.receiveShadow = true; // Включение принятия теней для столбика
    scene.add(floor);

  
    // Создание материала для пола с упругостью
    const floorMat = new CANNON.Material('floorMaterial');
    floorMat.restitution = 0.72;

    // Создание формы и тела для пола
    const floorShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5));
    const floorBody = new CANNON.Body({mass: 0});
    floorBody.addShape(floorShape);
    floorBody.position.set(0, -0.1, 0);
    floorBody.material = floorMat; // Применение материала к телу пола
    world.addBody(floorBody);




    
    // Создание стен
    const wallGeometry = new THREE.PlaneGeometry(10, 3);
    const wallMaterial = new THREE.MeshPhongMaterial({map: texture});
    
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.z = -5;
    wall1.position.y = 1.5;
    wall1.castShadow = true; // Включение отбрасывания теней для столбика
    wall1.receiveShadow = true; // Включение принятия теней для столбика
    scene.add(wall1);


// Создание формы и тела для стены 1
const wall1Shape = new CANNON.Box(new CANNON.Vec3(5, 1.5, 0.1));
const wall1Body = new CANNON.Body({mass: 0});
wall1Body.addShape(wall1Shape);
wall1Body.position.set(wall1.position.x, wall1.position.y, wall1.position.z);
world.addBody(wall1Body);



    
    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.z = 5;
    wall2.position.y = 1.5;
    wall2.rotation.y = Math.PI;
    wall2.castShadow = true; // Включение отбрасывания теней для столбика
    wall2.receiveShadow = true; // Включение принятия теней для столбика
    scene.add(wall2);

    // Создание формы и тела для стены 2
const wall2Shape = new CANNON.Box(new CANNON.Vec3(5, 1.5, 0.1));
const wall2Body = new CANNON.Body({mass: 0});
wall2Body.addShape(wall2Shape);
wall2Body.position.set(wall2.position.x, wall2.position.y, wall2.position.z);
world.addBody(wall2Body);
    
    const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall3.position.x = -5;
    wall3.position.y = 1.5;
    wall3.rotation.y = Math.PI / 2;
    wall3.castShadow = true; // Включение отбрасывания теней для столбика
    wall3.receiveShadow = true; // Включение принятия теней для столбика
    scene.add(wall3);
    
// Создание формы и тела для стены 3
const wall3Shape = new CANNON.Box(new CANNON.Vec3(0.1, 1.5, 5));
const wall3Body = new CANNON.Body({mass: 0});
wall3Body.addShape(wall3Shape);
wall3Body.position.set(wall3.position.x, wall3.position.y, wall3.position.z);
world.addBody(wall3Body);


//     const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
//     wall4.position.x = 5;
//     wall4.position.y = 1.5;
//     wall4.rotation.y = -Math.PI / 2;
//     wall4.castShadow = true; // Включение отбрасывания теней для столбика
//     wall4.receiveShadow = true; // Включение принятия теней для столбика
//     scene.add(wall4);

//     // Создание формы и тела для стены 4
// const wall4Shape = new CANNON.Box(new CANNON.Vec3(0.1, 1.5, 5));
// const wall4Body = new CANNON.Body({mass: 0});
// wall4Body.addShape(wall4Shape);
// wall4Body.position.set(wall4.position.x, wall4.position.y, wall4.position.z);
// world.addBody(wall4Body);





    // скайбокс небо 
    const skyBoxGeometry = new THREE.SphereGeometry(900, 120, 110);
const skyBoxMaterial = new THREE.MeshBasicMaterial({map: sky, side: THREE.BackSide});
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
scene.add(skyBox);





    // Создание столбика
    const pillarGeometry = new THREE.BoxGeometry(0.2, 3, 0.2);
    const pillarMaterial = new THREE.MeshPhongMaterial({color: 0x808080});
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar.position.y = 1.5; // Установка позиции столбика по вертикали
    pillar.castShadow = true; // Включение отбрасывания теней для столбика
    pillar.receiveShadow = true; // Включение принятия теней для столбика
    scene.add(pillar);


    
    // коробка
    const boxGeometry = new THREE.BoxGeometry(1, 0.5, 1);
    const boxMaterial = new THREE.MeshPhongMaterial({map: boxTexture});
    box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-4, 0.25, -3.5);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);

    // Создание формы и тела для коробки
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 0.5));
    boxBody = new CANNON.Body({mass: 1});
    boxBody.addShape(boxShape);
    boxBody.position.set(-1, 5.25, -2.5);
    world.addBody(boxBody);


    // Создание материала для спрайта ВЗРЫВ
    explosionMaterial = new THREE.SpriteMaterial({map: explosionTexture});
    // Создание спрайта ВЗРЫВ
    // Настройка материала для отображения только первого кадра спрайта

explosionMaterial.map.offset.x = 0; // Установка смещения текстуры по горизонтали
explosionMaterial.map.repeat.x = 1 / frameCount; // Установка повторения текстуры по горизонтали
// Создание спрайта
explosionSprite = new THREE.Sprite(explosionMaterial);
explosionSprite.scale.set(2, 2, 1); // Установка размера спрайта
explosionSprite.visible = false; // Скрытие спрайта
scene.add(explosionSprite);




    // футбольный мяч 
    // мяч
    const footballGeometry = new THREE.SphereGeometry(0.25, 22, 22);
    const footballMaterial = new THREE.MeshLambertMaterial({map: footballTexture});
    football = new THREE.Mesh(footballGeometry, footballMaterial);
    football.position.set(-4, 0.25, -3.5);
    football.castShadow = true;
    football.receiveShadow = true;
    scene.add(football);

    // Создание материала с высокой упругостью МЯЧ 
    const bouncyMaterial = new CANNON.Material('bouncyMaterial');
    bouncyMaterial.restitution = 0.98;
    bouncyMaterial.friction = 2.5;
    // Создание формы и тела для сферы
    const sphereShape = new CANNON.Sphere(0.2);
    sphereBody = new CANNON.Body({mass: 0.3});
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(1, 5, -1);
    sphereBody.material = bouncyMaterial; // Применение материала к телу сферы
    world.addBody(sphereBody);


    // ГРАНАТА 
    modelLoader.load('models/granade/Granate06.glb', (gltf) => {
        grenade = gltf.scene;
    
        // Загрузка текстуры
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('models/granade/textures/granata-color24k_1.png');
    
        // Применение текстуры к материалу модели
        grenade.traverse((child) => {
        if (child.isMesh) {
        child.material.map = texture;
        }
        });
        // Изменение позиции и масштаба модели
        grenade.position.set(1, 1.6, 1);
        grenade.scale.set(1, 1, 1);
        scene.add(grenade);
    });

    // физика гранаты
    const granadeGeometry = new CANNON.Box(new CANNON.Vec3(0.03, 0.1, 0.03)); // Создание формы цилиндра с радиусом верхнего и нижнего оснований 1, высотой 2 и 8 сегментами
    granadeBody = new CANNON.Body({mass: 4}); // Создание тела с массой 1
    granadeBody.addShape(granadeGeometry); // Добавление формы к телу
    granadeBody.position.set(1, 3, 1); // Установка позиции тела
    world.addBody(granadeBody); // Добавление тела в физический мир



    // пистолет
    modelLoader.load('models/handgun/handgun.glb', (gltf) => {
        const handgun = gltf.scene;
    
        // Загрузка текстуры
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('models/handgun/textures/R.5413a0338ecb7671f7ca88b87af8cd0e_0.png');
    
        // Применение текстуры к материалу модели
        handgun.traverse((child) => {
        if (child.isMesh) {
        child.material.map = texture;
        }
        });
        // Изменение позиции и масштаба модели
        handgun.position.set(1, 1.4, 1.3);
        handgun.scale.set(0.03, 0.03, 0.03);
        scene.add(handgun);
    });


    // бочка красная red barrel 
    modelLoader.load('models/red_barrel/half_life_inspired_explosive_barrel.glb', (gltf) => {
        const red_barrel = gltf.scene;
    
        // Загрузка текстуры
        const textureLoader = new THREE.TextureLoader();
        // const texture = textureLoader.load('models/red_barrel/half_life_inspired_explosive_barrel.png');
    
        // Применение текстуры к материалу модели
        red_barrel.traverse(object => {
            if (object.isMesh) {
                object.material.emissive.set(0x111111);
            }
        });
        // Изменение позиции и масштаба модели
        red_barrel.position.set(-2, 0.8, -1.3);
        red_barrel.scale.set(0.02, 0.02, 0.02);
        scene.add(red_barrel);
    });


    
 


    


}

function animate() {
    requestAnimationFrame(animate);


    // Обновление мира физики
    world.step(1/60);
    // Обновление визуализации физических тел
    cannonDebugRenderer.update();



   
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
   
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
   
    if (moveForward) velocity.z -= 10.0 * delta * (moveFast ? 5 : 1);
    if (moveBackward) velocity.z += 10.0 * delta * (moveFast ? 5 : 1);
    if (moveLeft) velocity.x -= 10.0 * delta * (moveFast ? 5 : 1);
    if (moveRight) velocity.x += 10.0 * delta * (moveFast ? 5 : 1);
   
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
   
    // Обновление вертикальной позиции камеры
    controls.getObject().position.y += velocityY * delta; // Новая позиция
    velocityY += gravity * delta; // Применение гравитации
   
    // Проверка столкновения с полом
    if (controls.getObject().position.y < 1.6) {
    velocityY = 0; // Остановить вертикальное движение
    controls.getObject().position.y = 1.6; // Установить позицию на уровне пола
    canJump = true; // Разрешить прыжок
    }
   
    prevTime = time;
   
    // Обновление позиции и ориентации визуальной коробки
    box.position.copy(boxBody.position);
    box.quaternion.copy(boxBody.quaternion);
    //     // Обновление позиции и ориентации визуальной камеры
    // camera.position.copy(cameraBody.position);
    // camera.quaternion.copy(cameraBody.quaternion);


    // Обновление позиции и ориентации визуального мяча
  football.position.copy(sphereBody.position);
  football.quaternion.copy(sphereBody.quaternion);


// Обновление позиции и ориентации модели гранаты
if (grenade) {
    grenade.position.copy(granadeBody.position);
    grenade.quaternion.copy(granadeBody.quaternion);
}


  

    renderer.render(scene, camera);
   }