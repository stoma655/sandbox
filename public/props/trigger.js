function trigger(x, y, z) {


// Создание формы ящика с размерами 1x1x1
var shape = new CANNON.Box(new CANNON.Vec3(1.5, 0.2, 1.5));
// Создание тела с массой 0 (неподвижное тело)
var body = new CANNON.Body({ mass: 0 });
body.position.set(x, y, z);
body.addShape(shape);
// Добавление тела в мир
world.addBody(body);


// Установка группы коллизии и маски коллизии для тела
// body.collisionFilterGroup = 2;
// body.collisionFilterMask = 0;

// Добавление прослушивателя событий к телу объекта
body.addEventListener("collide", function(e) {
    // Получение тела, с которым произошло столкновение
    var otherBody = e.body;
    if (otherBody === modelBody) {
        // Выполнение определенной функции при столкновении с телом игрока
        // Получение относительной скорости в точке контакта
        var relativeVelocity = e.contact.getImpactVelocityAlongNormal();
        // Выполнение определенной функции в зависимости от количества энергии в столкновении
        if (Math.abs(relativeVelocity) > 10) {
            // Больше энергии
            console.log('1')
        } else {
            // Меньше энергии
            console.log('2')
        }
    }
});


  

};