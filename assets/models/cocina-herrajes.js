/* Herrajes de la cocina final repartidos por módulo: [cantidad, herraje, detalle].
   Salen de la hoja Compras de despiece-cocina.xlsx; las cantidades por módulo suman las del Excel
   (24 bisagras = 2 por puerta en 11 puertas + 2 en el techo de S2; 24 soportes = 4 por entrepaño; 10 fijaciones de gola).
   Si cambia el Excel, actualizar también este reparto. */
window.CocinaPropuestaHerrajes={
 modules:{
  B1:[[1,'Condimentero HSO317-15R','Herraje 100 × 446 × 470 para módulo nominal 150. Incluye rieles laterales y enganches del frente; el conjunto mide 135 mm en 150 libres.'],[4,'Pata niveladora 100 mm',''],[1,'Perfil gola superior · tramo 180 mm','Del perfil gola superior × 3 m.'],[2,'Fijación metálica gola con tornillo','Extremos del tramo. Referencia compatible por confirmar con el proveedor del perfil.']],
  B2:[[4,'Pata niveladora 100 mm','']],
  B3:[[1,'Riel HRE550-55N Bonuit negro 550 mm · par','Cajón cubiertero: vano 640 − 27 = caja exterior 613; interior 583 × 520. Incluye 12 tornillos 4 × 12.'],[1,'Cubiertero HSC910-40','360 × 480 × 50 dentro del cajón.'],[4,'Bisagra parche HBM897-01','2 por puerta inferior.'],[4,'Soporte de entrepaño','Entrepaño regulable inferior.'],[4,'Pata niveladora 100 mm',''],[1,'Perfil gola superior · parte del tramo 1770 mm','Tramo continuo sobre B3, B5 y B4.'],[1,'Perfil gola media · tramo 670 mm','Bajo el cajón cubiertero.'],[4,'Fijación metálica gola con tornillo','2 en gola superior y 2 en gola media.']],
  B5:[[4,'Bisagra parche HBM897-01','2 por puerta.'],[4,'Soporte de entrepaño','Entrepaño desmontable con canto en sus cuatro bordes (2 mm delante y 0,45 mm en el resto). Recorte del sifón en obra, con sellado del corte.'],[4,'Pata niveladora 100 mm',''],[1,'Soporte mecánico de lavaplatos','PENDIENTE: compatibilidad Socoda, placa 15 mm y cargas de uso.'],[1,'Fijación metálica gola con tornillo','Gola superior, tramo de 1770 mm.']],
  B4:[[1,'Basurero HSO688-00 · 12 L','Bandeja 330 × 485, altura 215; dos recipientes de 6 L. No incluye rieles ni soporte extraíble.'],[1,'Riel HRE126-55 · par','550 mm, extensión total, 38 kg, cierre normal. Incluye 12 tornillos. Descuento de 27 mm supuesto: confirmar antes de cortar P072–P074.'],[2,'Bisagra parche HBM897-01','Puerta superior.'],[4,'Pata niveladora 100 mm',''],[1,'Perfil gola media · tramo 400 mm',''],[3,'Fijación metálica gola con tornillo','1 en gola superior y 2 en gola media.']],
  B6:[],
  S1:[[2,'Bisagra parche HBM897-01',''],[1,'Colgador regulable superior · par','Verificar cabida en la caja de luz 165.'],[4,'Soporte de entrepaño','']],
  S2:[[2,'Bisagra parche HBM897-01','Orientadas en el techo para la puerta abatible hacia arriba.'],[2,'Brazo neumático HEC060-03 gris 60 N','Apertura 90°. Cada brazo incluye 2 platinas y 5 tornillos. Puerta ≈ 2,07 kg: validar fuerza y montaje con el proveedor.'],[1,'Colgador regulable superior · par','']],
  S3:[[4,'Bisagra parche HBM897-01','2 por puerta.'],[1,'Colgador regulable superior · par',''],[8,'Soporte de entrepaño','Dos entrepaños, uno a cada lado de la división.']],
  S4:[[4,'Bisagra parche HBM897-01','2 por puerta.'],[1,'Colgador regulable superior · par',''],[1,'Platero HSO566-03G','680 × 245 en luz 685; 7 kg máximo. Pines Ø10 marcados con el herraje en obra.']],
  S5:[[2,'Bisagra parche HBM897-01',''],[1,'Colgador regulable superior · par',''],[4,'Soporte de entrepaño','']]
 },
 general:'Para toda la cocina, sin asignar a un módulo: 4 patas niveladoras de refuerzo por distribuir según cargas; unos 150 tornillos de armado 4 × 50 y 150 de herrajes 4 × 16 (cantidad preliminar); riel mural y fijaciones superiores pendientes. Comprobar compatibilidad de la bisagra HBM897-01 con brazo, peso y ángulo.'
};
