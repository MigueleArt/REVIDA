Animaciones accesibles y optimización de performance - ELZ


1. ¿Cuál es la diferencia entre animaciones CSS y JavaScript?
Animaciones CSS: Son las más sencillas y ligeras. Se escriben directamente en el archivo de diseño (estilos). Son perfectas para cosas simples como que un botón cambie de color o una tarjeta se mueva un poco al pasar el mouse.

Animaciones JavaScript: Son más potentes. Se usan cuando queremos que algo se mueva según lo que el usuario haga (por ejemplo, que algo siga al cursor o se mueva al hacer scroll). Son como un director de orquesta que controla cada segundo del movimiento.

2. ¿Cuándo una animación mejora o perjudica la experiencia?
Mejora: Cuando nos ayuda a entender qué pasó. Por ejemplo, si das clic en "Enviar" y aparece un circulito cargando, sabes que la app está trabajando. Nos da seguridad.

Perjudica: Cuando es muy lenta, muy exagerada o no tiene sentido. Si para leer un texto tengo que esperar 3 segundos a que termine de dar vueltas, la animación se vuelve un estorbo.

3. ¿Qué es prefers-reduced-motion y por qué importa?
Es una opción que tienen las computadoras y celulares para "reducir el movimiento". Es muy importante por accesibilidad: algunas personas sufren mareos o náuseas con los movimientos rápidos en pantalla. Si esta opción está activa, nuestra app debe apagar sus animaciones para cuidar la salud del usuario.

4. ¿Cómo afectan las animaciones al rendimiento?
Si usamos animaciones muy pesadas o mal hechas, la página se puede "trabar" o verse lenta (como un video que se pausa). Esto pasa porque el navegador tiene que esforzarse mucho para redibujar la pantalla. Usar propiedades simples como "opacidad" ayuda a que todo vaya fluido.

5. Errores comunes al animar
Poner demasiadas cosas moviéndose al mismo tiempo (distrae mucho).
Hacer animaciones que duran demasiado tiempo.
No dejar que el usuario pueda desactivar los movimientos si le molestan