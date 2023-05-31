// THREE.ShaderChunk.shadowmap_pars_fragment = THREE.ShaderChunk.shadowmap_pars_fragment.replace( 'return shadow;', 'return max( 0.7, shadow );' );
// THREE.VolumetricLightScatteringPass
let camera, scene, renderer;
let controls;
// let moveForward = false;
// let moveBackward = false;
// let moveLeft = false;
// let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();

let mixer;

let cameraBody

let helper 

let world
let cannonDebugRenderer


let velocityY = 0;
const gravity = -30;

let supply_boxes = [];
let supply_boxesBodys = [];

let footballs = [];
let footballsBodys = [];


let grenade
let granadeBody


let table 
let tableBody

let explosionSprite
let explosionMaterial
const frameCount = 11; // Количество кадров в спрайте

const particles = [];
const particleBodies = [];

let carriedObject = null; // Ссылка на поднимаемый объект
let carryDistance = 0; // Расстояние от камеры до объекта

let elevatorBody;

let cylinderBodys = []
let red_barrels = []


let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let modelBody;

init();
animate();
let moveFast = false;
let particleSystem;



// function checkTriggers() {
//     console.log('ses')
// };


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
    // camera.position.set(0, -3.6, 0);

    // Использование cannon-debugger для визуализации физических тел
    cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

    // Создание рендерера
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap; // Использование BasicShadowMap
    

    document.body.appendChild(renderer.domElement);

    // Создание контролов для передвижения
    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    // Активация PointerLockControls при клике на страницу
    document.addEventListener('click', () => {
        controls.lock();
    });

    // // Обработка нажатия клавиш WASD
    // const onKeyDown = (event) => {
    //     switch (event.code) {
    //       case 'KeyW':
    //         moveForward = true;
    //         break;
    //       case 'KeyA':
    //         moveLeft = true;
    //         break;
    //       case 'KeyS':
    //         moveBackward = true;
    //         break;
    //       case 'KeyD':
    //         moveRight = true;
    //         break;
    //     }
    //   };
      
    //   const onKeyUp = (event) => {
    //     switch (event.code) {
    //       case 'KeyW':
    //         moveForward = false;
    //         break;
    //       case 'KeyA':
    //         moveLeft = false;
    //         break;
    //       case 'KeyS':
    //         moveBackward = false;
    //         break;
    //       case 'KeyD':
    //         moveRight = false;
    //         break;
    //     }
    //   };
      


    const onKeyDown = (event) => {
     switch (event.code) {
     case 'KeyW':
        moveRight = true;
     break;
     case 'KeyA':
        moveBackward = true;
     
     break;
     case 'KeyS':
        moveLeft = true;
     break;
     case 'KeyD':
        
        moveForward = true;
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
        moveRight = false;
     break;
     case 'KeyA':
        moveBackward = false;
     break;
     case 'KeyS':
        moveLeft = false;
     break;
     case 'KeyD':
        moveForward = false;
        
     break;
     case 'ShiftLeft':
     case 'ShiftRight':
     moveFast = false;
     break;
     }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    // document.addEventListener('keydown', event => {
    //     if (event.code === 'KeyE') {
    //       // Создание луча
    //       const raycaster = new THREE.Raycaster();
    //       const direction = new THREE.Vector3();
    //       camera.getWorldDirection(direction);
    //       raycaster.set(camera.position, direction);
    //       raycaster.camera = camera; // Установка свойства camera объекта raycaster
      
    //       // Определение точки пересечения луча с физическими объектами
    //       const objects = scene.children.filter(object => object !== null); // Фильтрация массива scene.children
    //       const intersects = raycaster.intersectObjects(objects);
    //       if (intersects.length > 0) {
    //         const position = intersects[0].point;
    //         // Создание взрыва в точке пересечения
    //         explode(position);
    //       }
    //     }
    //   });

    // Создание формы и тела для модели игрока 
    const modelShape = new CANNON.Sphere(0.5, 33);
    modelBody = new CANNON.Body({mass: 2});
    modelBody.addShape(modelShape);
    modelBody.position.set(4, 1, -3);
    world.addBody(modelBody);
    

      
    document.addEventListener('keydown', event => {
        if (event.code === 'KeyE') {
          // Создание луча
          const from = new CANNON.Vec3().copy(camera.position);
          const to = new CANNON.Vec3();
          camera.getWorldDirection(to);
          to.scale(100, to); // Установка длины луча
          to.vadd(from, to); // Установка конечной точки луча
      
          // Определение точки пересечения луча с физическими объектами
          const result = new CANNON.RaycastResult();
          world.raycastClosest(from, to, {}, result);
          if (result.hasHit) {
            const position = result.hitPointWorld;
            // Создание взрыва в точке пересечения
            explode(position);
            createExplosion(position);



            
            // console.log(position)
          }
        }
      });



// Обработчик нажатия клавиши F
document.addEventListener('keydown', event => {
    if (event.code === 'KeyF') {
        if (carriedObject) {
            // Если объект уже поднят, опустить его
            carriedObject = null;
        } else {
            // Создание луча из позиции камеры в направлении ее взгляда
            const raycaster = new THREE.Raycaster();
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction);
            raycaster.set(camera.position, direction);

            // Определение пересечения луча с физическими объектами
            const objects = []; // Массив физических объектов
            const intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
                // Сохранение ссылки на физическое тело и расстояния до него
                carriedObject = intersects[0].object;
                carryDistance = intersects[0].distance;
            }
        }
    }
});



      function createExplosion(position) {
        const particleCount = 23;
        const particleGeometry = new THREE.SphereGeometry(0.025);
        const particleMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
      
        const particlesToRemove = [];
        const particleBodiesToRemove = [];
      
        for (let i = 0; i < particleCount; i++) {
          const particle = new THREE.Mesh(particleGeometry, particleMaterial);
          particle.position.copy(position);
          scene.add(particle);
          particles.push(particle);
          particlesToRemove.push(particle);
      
          // Создание материала для частиц с упругостью
        const particlePhysicsMaterial = new CANNON.Material();
        particlePhysicsMaterial.restitution = 0.99;
        particlePhysicsMaterial.friction = 0.99;

          const particleBody = new CANNON.Body({mass: 0.1});
          particleBody.addShape(new CANNON.Sphere(0.025));
          particleBody.material = particlePhysicsMaterial;
          particleBody.position.copy(position);
          world.addBody(particleBody);
          particleBodies.push(particleBody);
          particleBodiesToRemove.push(particleBody);
      
          const force = new CANNON.Vec3(
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7,
            (Math.random() - 0.5) * 7
          );
          particleBody.applyImpulse(force, particleBody.position);
        }
      
        // Удаление частиц через 3 секунды
        setTimeout(() => {
          particlesToRemove.forEach(particle => {
            scene.remove(particle);
            particles.splice(particles.indexOf(particle), 1);
          });
          particleBodiesToRemove.forEach(particleBody => {
            world.remove(particleBody);
            particleBodies.splice(particleBodies.indexOf(particleBody), 1);
          });
        }, 1500);
      }

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
    
    
    
    const explosionTexture = loader.load('img/explosion.png');
    // const sky = loader.load('img/sky.png');
    const sky = loader.load('img/vecher.webp');
    const grass = loader.load('img/grass.png');
    // пофтор текстур а не растягивание  стен
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // пофтор текстур а не растягивание пола


    grass.wrapS = THREE.RepeatWrapping;
    grass.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(5, 8); // Повторить текстуру 4 раза по горизонтали и 1 раз по вертикали
    
    grass.repeat.set(37, 37);



    // const ambientLight = new THREE.AmbientLight(0xFE642E, 0.3);
    // scene.add(ambientLight);



    // const light = new THREE.DirectionalLight(0xFE642E, 0.3);
    // light.position.set(18, 5, 78);
    // // включение теней 
    // // light.castShadow = true; 

    // // сдвиг карты теней для устранения артефактов 
    // // light.shadow.bias = -0.0005;
    // // размер карты теней 
    // light.shadow.mapSize.set(8848, 8848);
    // light.shadow.radius = 223;

    // // дальность создания оброботки теней 
    // light.shadow.camera.left = -60;
    // light.shadow.camera.right = 60;
    // light.shadow.camera.top = 60;
    // light.shadow.camera.bottom = -60;


    // scene.add(light);

    // // Создание сферы для представления источника света
    // const lightSphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    // const lightSphereMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    // const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
    // lightSphere.position.copy(light.position); // Установка позиции сферы на позицию источника света
    // scene.add(lightSphere);






//projector
// прожектор 
var proj = new THREE.SpotLight(0xffff00, 6, 50, Math.PI / 12, 145);
proj.position.set(25, 35, -45);
proj.target.position.set(0, -39, 0);
proj.castShadow = true;
scene.add(proj.target)
scene.add(proj)


helper = new THREE.SpotLightHelper(proj);
scene.add(helper);



// ТРАВА 
// Создание большого куска земли
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({map: grass});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.set(55, 0.1, 0);
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


    elevator(-8.1,-4,-3.1)


    potolok(3, 4, -3)
    potolok(-1, 4, -3)
    potolok(-5, 4, -3)

    floor(3, 0, -3)
    floor(-5, -4, -3)


    wall_build_prop(3, 2, -5, 2);
    wall_build_prop(-1, 2, -5, 2);
    wall_build_prop(-5, 2, -5, 2);
    wall_build_prop(-1, -2, -5, 2);
    wall_build_prop(-5, -2, -5, 2);
    trigger(-5, -4.1, -3);
    
    wall_build_prop(-7, 2, -3, 1);
    // wall_build_prop(-7, 2, -3, 1);
    // wall_build_prop(-7, 2, -1, 1);
    // wall_build_prop(-7, 2, -5, 1);
    // wall_build_prop(-1, 2, 0);
    // wall_build_prop(-5, 2, -5);

    wall_build_prop(3, 2, -1, 2);
    wall_build_prop(-1, 2, -1, 2);
    wall_build_prop(-5, 2, -1, 2);
    wall_build_prop(-1, -2, -1, 2);
    wall_build_prop(-5, -2, -1, 2);

    // bunker_door(4.9,0.1,1.3)
    // wall_build_prop(5, 2, -3, 1);

    step(1, -0.19, -3);
    step(0.6, -0.4, -3)
    step(0.2, -0.8, -3)
    step(-0.2, -1.2, -3)
    step(-0.6, -1.6, -3)
    step(-1, -2, -3)
    step(-1.4, -2.4, -3)
    step(-1.8, -2.8, -3)
    step(-2.2, -3.2, -3)
    step(-2.6, -3.6, -3)
    step(-3, -4, -3)
    // step(-3.4, -4.4, -3)
    // step(-3.8, -4.8, -3)
    // step(-4.2, -5.2, -3)
    // step(-4.6, -5.4, -3)

    // скайбокс небо 
    const skyBoxGeometry = new THREE.SphereGeometry(900, 120, 110);
    const skyBoxMaterial = new THREE.MeshBasicMaterial({map: sky, side: THREE.BackSide});
    const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);




// pillar_prop(2, 1.5, 0);
// pillar_prop(3, 1.5, 0);

    
// supply_box_prop(-4, 0.25, -3.5);
// supply_box_prop(-4.2, 0.55, -3.6);
// supply_box_prop(-4, 1.25, -3.7);
// supply_box_prop(-4.4, 2.15, -3.8);
// supply_box_prop(-4, 2.65, -3.5);
// supply_box_prop(-4.2, 3.15, -3.5);
// supply_box_prop(-4.1, 3.65, -3.5);
// supply_box_prop(-4.3, 4.15, -3.6);
// supply_box_prop(-4.4, 4.65, -3.7);

// supply_box_prop(-2, 0.25, -3.5);
// supply_box_prop(-2.2, 0.55, -3.6);
// supply_box_prop(-2, 1.25, -3.7);
// supply_box_prop(-2.4, 2.15, -3.8);
// supply_box_prop(-2, 2.65, -3.5);
// supply_box_prop(-2.2, 3.15, -3.5);
// supply_box_prop(-2.1, 3.65, -3.5);
// supply_box_prop(-2.3, 4.15, -3.6);
// supply_box_prop(-2.4, 4.65, -3.7);

// supply_box_prop(-4, 0.25, -1.5);
// supply_box_prop(-4.2, 0.55, -1.6);
// supply_box_prop(-4, 1.25, -1.7);
// supply_box_prop(-4.4, 2.15, -1.8);
// supply_box_prop(-4, 2.65, -1.5);
// supply_box_prop(-4.2, 3.15, -1.5);
// supply_box_prop(-4.1, 3.65, -1.5);
// supply_box_prop(-4.3, 4.15, -1.6);
// supply_box_prop(-4.4, 4.65, -1.7);

// supply_box_prop(-2, 0.25, -1.5);
// supply_box_prop(-2.2, 0.55, -1.6);
// supply_box_prop(-2, 1.25, -1.7);
// supply_box_prop(-2.4, 2.15, -1.8);
// supply_box_prop(-2, 2.65, -1.5);
// supply_box_prop(-2.2, 3.15, -1.5);
// supply_box_prop(-2.1, 3.65, -1.5);
// supply_box_prop(-2.3, 4.15, -1.6);
// supply_box_prop(-2.4, 4.65, -1.7);



// football_prop(3, 0.25, -3.5)
// football_prop(3.4, 0.25, -3.5)


redBarrel_prop(4, 4.85, -3.5)
redBarrel_prop(4, 3.25, -3.5)
// redBarrel_prop(4, 2.25, -3.5)
// redBarrel_prop(4, 0.25, -3.5)








// Создание элемента видео
// const video = document.createElement('video');
// video.src = 'footagecrate-aerial-explosion-with-debris-smoke-1_VP9.webm'; // или 'explosion.mov'
// video.loop = true;
// video.muted = true;
// video.play();
// // Создание текстуры из видео
// const texture3 = new THREE.VideoTexture(video);
// texture3.format = THREE.RGBAFormat;
// // Создание материала с текстурой
// const material = new THREE.MeshBasicMaterial({map: texture3, transparent: true});
// // Создание плоскости
// const geometry = new THREE.PlaneGeometry(1, 1);
// const mesh = new THREE.Mesh(geometry, material);
// // Установка позиции плоскости
// mesh.position.set(1, 1, 1);
// mesh.scale.set(5, 5, 5);
// // Добавление плоскости в сцену
// scene.add(mesh);



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




    

    // modelLoader.load('models/monster/monster.glb', (gltf) => {
    //     const monster = gltf.scene;
    //     monster.traverse((child) => {
    //         child.castShadow = true;
    //         // child.receiveShadow = true;
    //     });
    //     monster.position.set(0, 0, 0);
    //     monster.scale.set(1, 1, 1);
    //     scene.add(monster);
    
    //     mixer = new THREE.AnimationMixer(monster);
    //     const animation = gltf.animations[0];
    //     mixer.clipAction(animation).play();
    // });







        // Создаем тело для ящика
// var boxBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 0, 0)
// });

// // Создаем формы для стенок ящика
// var boxShape1 = new CANNON.Box(new CANNON.Vec3(1, 1, 0.1));
// var boxShape2 = new CANNON.Box(new CANNON.Vec3(1, 1, 0.1));
// var boxShape3 = new CANNON.Box(new CANNON.Vec3(0.1, 1, 1));
// var boxShape4 = new CANNON.Box(new CANNON.Vec3(0.1, 1, 1));

// // Добавляем формы к телу
// boxBody.addShape(boxShape1, new CANNON.Vec3(0, 0, -1));
// boxBody.addShape(boxShape2, new CANNON.Vec3(0, 0, 1));
// boxBody.addShape(boxShape3, new CANNON.Vec3(-1, 0, 0));
// boxBody.addShape(boxShape4, new CANNON.Vec3(1, 0, 0));

// // Добавляем тело в мир
// world.addBody(boxBody);


        // BUILD
        // modelLoader.load('models/build//build.glb', (gltf) => {
        //     const model = gltf.scene;
        
        //     model.position.set(112, -140, 42);
        //     // model.scale.set(0.11, 0.11, 0.11);
        //     scene.add(model);
        // });




        // // old house 
        // modelLoader.load('models/old_house/old_house.glb', (gltf) => {
        //     const model = gltf.scene;
        
        //     model.traverse((child) => {
        //         if (child.isMesh) {
        //             // Создание нового материала с текстурой из оригинального материала
        //             const originalMaterial = child.material;
        //             const newMaterial = new THREE.MeshPhongMaterial({
        //                 map: originalMaterial.map
        //             });
        //             child.material = newMaterial;
        //         }
        //         child.castShadow = true;
        //         child.receiveShadow = true;
        //     });
        
        //     model.position.set(22, 3, 12);
        //     model.scale.set(0.11, 0.11, 0.11);
        //     scene.add(model);
        // });


    // // ГРАНАТА 
    // modelLoader.load('models/granade/Granate06.glb', (gltf) => {
    //     grenade = gltf.scene;
    
    //     // Загрузка текстуры
    //     const textureLoader = new THREE.TextureLoader();
    //     const texture = textureLoader.load('models/granade/textures/granata-color24k_1.png');
    
    //     // Применение текстуры к материалу модели
    //     grenade.traverse((child) => {
    //     if (child.isMesh) {
    //     child.material.map = texture;
    //     }
    //     });
    //     // Изменение позиции и масштаба модели
    //     grenade.position.set(1, 1.6, 1);
    //     grenade.scale.set(1, 1, 1);
    //     scene.add(grenade);
    // });

    // // физика гранаты
    // const granadeGeometry = new CANNON.Box(new CANNON.Vec3(0.03, 0.1, 0.03)); // Создание формы цилиндра с радиусом верхнего и нижнего оснований 1, высотой 2 и 8 сегментами
    // granadeBody = new CANNON.Body({mass: 2}); // Создание тела с массой 1
    // granadeBody.addShape(granadeGeometry); // Добавление формы к телу
    // granadeBody.position.set(1, 3, 1); // Установка позиции тела
    // world.addBody(granadeBody); // Добавление тела в физический мир


   
    // bunker light
    modelLoader.load('models/bunker_light/bunker_light.glb', (gltf) => {
        const walllight = gltf.scene;
        // 0x8B0000
        const bulbLight = new THREE.PointLight(0xf6f3d3, 1.2, 10);
        bulbLight.position.set(-6, -3, -4.5); // Установите позицию лампочки
        bulbLight.castShadow = true;
        bulbLight.shadow.mapSize.set(210, 210);
        scene.add(bulbLight);// Изменение позиции и масштаба модели

        walllight.position.set(-6, -3, -4.8);
        // walllight.position.set(-6, -3, -4.8);
        walllight.scale.set(0.006, 0.006, 0.006);
        walllight.rotateX(90 * Math.PI / 180);

        scene.add(walllight);
    });



    // Определение триггера для опускания лифта
// const trigger = true;

// Определение функции для опускания лифта
function lowerElevator() {
  // Проверка триггера
//   if (trigger) {
    // Определение интервала для опускания лифта
    const interval = setInterval(() => {
      // Изменение позиции тела лифта
      elevatorBody.position.y -= 0.02;
      
      // Остановка опускания лифта после достижения нужного расстояния
      if (elevatorBody.position.y <= -25) {
        clearInterval(interval);
      }
    }, 10);
//   }
}

// Вызов функции для опускания лифта
setTimeout(() => {
    lowerElevator();
}, 4000);



    // // wall light
    // modelLoader.load('models/wall_light/scifi_light_04.glb', (gltf) => {
    //     const walllight = gltf.scene;
    
    //     const bulbLight = new THREE.PointLight(0xf6f3d3, 1.8, 10);
    //     bulbLight.position.set(-6, -3, -4.4); // Установите позицию лампочки
    //     bulbLight.castShadow = true;
    //     bulbLight.shadow.mapSize.set(210, 210);
    //     scene.add(bulbLight);// Изменение позиции и масштаба модели

    //     walllight.position.set(3, 3.4, 4.9);
    //     walllight.scale.set(0.01, 0.01, 0.01);
    //     walllight.rotation.x = Math.PI / 2;
    //     walllight.rotation.z = 110;
    //     walllight.rotation.y = 190;
    //     scene.add(walllight);
    // });


    // wall light
    modelLoader.load('models/wall_light/scifi_light_04.glb', (gltf) => {
        const walllight = gltf.scene;
        // 0x8B0000
        const bulbLight = new THREE.PointLight(0x8B0000, 1.3, 12);
        // bulbLight.position.set(4.4, 3, -3); // Установите позицию лампочки
        bulbLight.position.set(4.4, 3, -3); // Установите позицию лампочки
        bulbLight.castShadow = true;
        bulbLight.shadow.mapSize.set(210, 210);
        scene.add(bulbLight);// Изменение позиции и масштаба модели


        walllight.position.set(4.4, 3.3, -3);
        walllight.scale.set(0.01, 0.01, 0.01);
        walllight.rotation.x = Math.PI / 2;
        walllight.rotation.z = 110;
        walllight.rotation.y = 190;
        scene.add(walllight);


        let lightOn = true;
        setInterval(() => {
            if (lightOn) {
                bulbLight.intensity = 0;
            } else {
                bulbLight.intensity = 3.1;
            }
            lightOn = !lightOn;
        }, 1400);
    });





//     // Обработка движения мыши
// controls.addEventListener('change', () => {
//     // Получение направления взгляда камеры
//     const direction = new THREE.Vector3();
//     camera.getWorldDirection(direction);
  
//     // Вычисление силы для перемещения модели
//     const force = new CANNON.Vec3();
//     if (moveForward) force.z -= direction.z * 10;
//     if (moveBackward) force.z += direction.z * 10;
//     if (moveLeft) force.x -= direction.x * 10;
//     if (moveRight) force.x += direction.x * 10;
  
//     // Применение силы к физическому телу модели
//     modelBody.applyForce(force, modelBody.position);
//   });
    





// world.addEventListener('beginContact', function(event) {
//     console.log('contact')
//     // Получение тел, участвующих в контакте
//     var bodyA = event.bodyA;
//     var bodyB = event.bodyB;

//     // Проверка, является ли одно из тел нашим боксом
//     // if (bodyA === body || bodyB === body) {
//     //     // Определение другого тела
//     //     var otherBody = (bodyA === body) ? bodyB : bodyA;

//     //     // Здесь вы можете добавить код для обработки пересечения с другим телом
//     //     console.log('Box collided with', otherBody);
//     // }
// });

}

function animate() {
    requestAnimationFrame(animate);


    // Обновление мира физики
    world.step(1/60);
    // Обновление визуализации физических тел
    cannonDebugRenderer.update();

    // checkTriggers();

    // Обновление ориентации модели
    // modelBody.quaternion.copy(camera.quaternion);
     // Обновление позиции камеры
    camera.position.copy(modelBody.position);
    camera.position.y += 1.4; // Смещение камеры вверх

    // Получение направления взгляда камеры
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Вычисление скорости для перемещения модели
    const speed = new CANNON.Vec3();
    if (moveForward) {
        speed.x -= direction.z * 5;
        speed.z += direction.x * 5;
    }
    if (moveBackward) {
        speed.x += direction.z * 5;
        speed.z -= direction.x * 5;
    }
    if (moveLeft) {
        speed.x -= direction.x * 5;
        speed.z -= direction.z * 5;
    }
    if (moveRight) {
        speed.x += direction.x * 5;
        speed.z += direction.z * 5;
    }
    // modelBody.angularVelocity.set(0, 0, 0);
    modelBody.quaternion.set(0, 0, 0, 1);
    // modelBody.position.y = 2;
    // Установка скорости физического тела модели
    modelBody.velocity.set(speed.x, modelBody.velocity.y, speed.z);





   
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
   

    prevTime = time;
   
    // Обновление позиции и ориентации визуальной коробки
if (supply_boxes) {
    // console.log(supply_boxesBodys)
    supply_boxes.forEach((el, index) => {
        el.position.copy(supply_boxesBodys[index].position);
        el.quaternion.copy(supply_boxesBodys[index].quaternion);
    });

}

    //     // Обновление позиции и ориентации визуальной камеры
    // camera.position.copy(cameraBody.position);
    // camera.quaternion.copy(cameraBody.quaternion);

 // Обновление позиции и ориентации частиц
 for (let i = 0; i < particles.length; i++) {
    particles[i].position.copy(particleBodies[i].position);
    particles[i].quaternion.copy(particleBodies[i].quaternion);
  }
    // Обновление позиции и ориентации визуального мяча
if (footballs) {
    footballs.forEach((el, index) => {
        el.position.copy(footballsBodys[index].position);
        el.quaternion.copy(footballsBodys[index].quaternion);
    });
}



// Обновление позиции и ориентации модели гранаты
if (grenade) {
    grenade.position.copy(granadeBody.position);
    grenade.quaternion.copy(granadeBody.quaternion);
}

// Обновление позиции физического тела в функции animate
if (carriedObject) {
    // Определение позиции перед камерой на расстоянии carryDistance
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.multiplyScalar(carryDistance);
    const newPosition = camera.position.clone().add(direction);

    // Обновление позиции физического тела
    carriedObject.position.copy(newPosition);
}
  


if (carriedObject) {
    // Определение позиции перед камерой на расстоянии carryDistance
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.multiplyScalar(carryDistance);
    const newPosition = camera.position.clone().add(direction);

    // Обновление позиции физического тела
    carriedObject.position.copy(newPosition);
}


if (red_barrels) {

    red_barrels.forEach((el, index) => {
        el.position.copy(cylinderBodys[index].position);
        el.quaternion.copy(cylinderBodys[index].quaternion);
        const angle = THREE.MathUtils.degToRad(90); // Угол поворота в радианах
        el.rotateX(angle); // Поворот графического объекта вокруг оси Y на 45 градусов
    });



}
helper.update()

    // const delta = clock.getDelta();
    if (mixer) mixer.update(delta);



    renderer.render(scene, camera);
   }