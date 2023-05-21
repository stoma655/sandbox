let currentFrame = 0; // Текущий кадр спрайта

function explode(position) {
    // Показать спрайт взрыва
    explosionSprite.visible = true;
    explosionSprite.scale.set(5, 5, 1); // Установка размера спрайта
    explosionSprite.position.copy(position); // Установка позиции спрайта
  
    // Анимация спрайта
    const interval = setInterval(() => {
      currentFrame++; // Переключение на следующий кадр
      if (currentFrame >= frameCount) {
        clearInterval(interval); // Остановка анимации
        explosionSprite.visible = false; // Скрытие спрайта
        currentFrame = 0; // Сброс текущего кадра
      } else {
        explosionMaterial.map.offset.x = currentFrame / frameCount; // Обновление смещения текстуры
      }
    }, 9);
  
    // Координаты центра взрыва
    const explosionCenter = new CANNON.Vec3(position.x, position.y, position.z);
  
    // Сила взрыва
    const explosionStrength = 30;
  
    // Применение импульса к каждому телу в мире
    world.bodies.forEach(body => {
      // Вычисление расстояния от тела до центра взрыва
      const distance = body.position.vsub(explosionCenter);
  
      // Вычисление направления импульса
      const forceDirection = distance.unit();
  
      // Вычисление силы импульса
      let force = forceDirection.scale(explosionStrength);
  
      // Уменьшение силы импульса для тел, которые находятся дальше от центра взрыва
      force = force.scale(1 / distance.length());
  
      // Применение импульса к телу
      body.applyImpulse(force, body.position);
    });
  }
  