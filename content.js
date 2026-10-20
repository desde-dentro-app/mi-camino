// Guía propia, escrita con mis palabras a partir de los materiales de la retiro.
// Tipos de paso: do (hacer), audio (escuchar), write (escribir).
window.CONTENT = {
  ETAPAS: [
    { n: 1, name: 'Cerrar', txt: 'Mirar lo vivido, quedarte con lo bueno y soltar lo que pesa.', days: [1, 2] },
    { n: 2, name: 'Alinear', txt: 'Saber qué quieres de verdad y desmontar lo que te frena.', days: [3, 4] },
    { n: 3, name: 'Renacer', txt: 'Convertirte en la versión de ti que ya vive lo que deseas.', days: [5, 6] },
    { n: 4, name: 'Activar', txt: 'Soltar el control, sellar tu intención y sostenerlo con hábitos.', days: [7] },
  ],

  CYCLE: [
    {
      d: 1, title: 'Cerrar el año', time: '45–60 min',
      why: 'Lo que no cierras sigue ocupando espacio. Hoy miras lo que has vivido y te quedas con lo mejor de ello.',
      steps: [
        { t: 'do', text: 'Antes de empezar, bebe agua y muévete dos minutos. Escribirás mucho mejor.' },
        { t: 'write', id: 'g', q: 'Escribe 10 cosas por las que estás agradecida este año.', hint: 'Pueden ser pequeñas. Un momento, una conversación, una lección difícil que te enseñó algo.' },
        { t: 'write', id: 'a', q: '¿De qué estás más orgullosa en los últimos 12 meses? ¿Qué has superado y qué has creado?', hint: 'Mira desde enero para ver tu evolución completa.' },
        { t: 'write', id: 'b', q: '¿Qué dicen de ti esos logros y cómo los hiciste posibles?' },
        { t: 'write', id: 'c', q: '¿Qué dones y cualidades usaste? Apunta los que se repiten.', hint: 'Los que se repiten son tu esencia y tu huella única.' },
        { t: 'write', id: 'd', q: '¿Cuáles fueron tus mayores retos? ¿Qué dice de ti haberlos superado y cómo lo hiciste?', hint: 'Aunque sientas que no los has superado del todo, el hecho de estar aquí ya cuenta.' },
        { t: 'write', id: 'e', q: 'Relee todo. ¿Qué se vuelve posible para tus próximos 12 meses?' },
        { t: 'write', id: 'f', q: '¿Cómo puedes usar tus dones de forma más consciente este año?', hint: 'Escribe sin filtro. Lo que ves como defecto, bien usado, puede ser un don.' },
        { t: 'audio', id: 'dones', text: 'Escucha la meditación «Dones y cualidades». No fuerces: pueden llegar recuerdos o sensaciones, no solo palabras.' },
        { t: 'write', id: 'h', q: 'Anota lo que te llegó en la meditación.' },
      ],
    },
    {
      d: 2, title: 'Soltar y perdonar', time: '45 min',
      why: 'Lo que no perdonas sigue viviendo en ti. No hace falta soltarlo todo hoy: cada piedra que sueltas te hace más ligera.',
      steps: [
        { t: 'write', id: 'a', q: '¿Qué objetivos del año pasado no cumpliste?', hint: 'Sé amable contigo. No es para machacarte: es para decidir cuáles dejas ir y cuáles siguen importando.' },
        { t: 'write', id: 'b', q: '¿A quién o a qué culpas de ello? Incluida tú.', hint: 'Sácalo todo, sin tabúes. Solo tú lo leerás.' },
        { t: 'audio', id: 'perdon', text: 'Escucha la «Meditación del perdón». Lo haces por ti, no por los demás. No tienes que volver a hablar con nadie.' },
        { t: 'write', id: 'c', q: '¿Cómo ha sido la experiencia? ¿Cuáles son los mayores aprendizajes (los regalos) de estos 12 meses?' },
        { t: 'write', id: 'd', q: 'Completa, una vez por aprendizaje: «Decido que… me servirá para…»' },
        { t: 'do', text: 'Pon la mano en el corazón y di en voz alta: «Gracias, este año queda completado. Me abro a lo que viene».' },
      ],
    },
    {
      d: 3, title: 'Descubrir lo que quiero', time: '60–90 min',
      why: 'No deseas todo con la misma fuerza. Hoy eliges dónde poner el foco y descubres para qué lo quieres.',
      steps: [
        { t: 'write', id: 'a', q: 'Rueda de la vida: puntúa del 1 al 5 salud, trabajo, dinero, familia, amistad, realización personal, amor y ocio.', hint: '1 es nada satisfecha y 5 es plenamente satisfecha. Sin juzgarte.' },
        { t: 'write', id: 'b', q: '¿Qué 2 áreas, si las mejoras, más impacto tendrían en todas las demás?' },
        { t: 'do', text: 'Si no sabes qué quieres: escribe lo que NO quieres y dale la vuelta en positivo. Ahí aparece lo que sí quieres.' },
        { t: 'write', id: 'c1', q: 'ÁREA 1 · ¿Cómo sería tu vida en esa área con un 5 sobre 5? Descríbela en presente y como si ya fuera real.', hint: 'No te cortes.' },
        { t: 'write', id: 'c2', q: 'ÁREA 1 · ¿Qué UN objetivo marcaría más diferencia en los próximos 12 meses?', hint: 'Una frase, en primera persona, en positivo y como si ya lo vivieras. Tan concreto como te permita sentir ilusión y no ansiedad. Ejemplo: «Genero 10.000 € al mes con mi proyecto. Esto o algo mejor, gracias».' },
        { t: 'write', id: 'c3', q: 'ÁREA 1 · ¿Para qué es importante para ti? ¿Por qué te lo mereces?', hint: 'Cuanto mayor es tu «para qué», más energía le pones. Empieza por ti: tienes derecho.' },
        { t: 'write', id: 'c4', q: 'ÁREA 1 · ¿Quién se beneficia si lo consigues? ¿Quién sufre si no lo haces?' },
        { t: 'write', id: 'c5', q: 'ÁREA 1 · ¿Cómo será tu vida dentro de 1 año y de 5 si no te comprometes con ello?' },
        { t: 'write', id: 'e1', q: 'ÁREA 2 · ¿Cómo sería tu vida en esa área con un 5 sobre 5?' },
        { t: 'write', id: 'e2', q: 'ÁREA 2 · ¿Qué UN objetivo marcaría más diferencia en los próximos 12 meses?', hint: 'Misma fórmula: primera persona, positivo, como si ya fuera real.' },
        { t: 'write', id: 'e3', q: 'ÁREA 2 · ¿Para qué es importante para ti?' },
        { t: 'write', id: 'e4', q: 'ÁREA 2 · ¿Quién se beneficia si lo consigues? ¿Quién sufre si no lo haces?' },
        { t: 'write', id: 'e5', q: 'ÁREA 2 · ¿Cómo será tu vida dentro de 1 año y de 5 si no te comprometes con ello?' },
      ],
    },
    {
      d: 4, title: 'Desmontar lo que me frena', time: '60–90 min',
      why: 'Tus creencias escriben el guion de tus resultados. Hoy las sacas a la luz y las debilitas, con calma.',
      steps: [
        { t: 'write', id: 'a', q: 'Escribe tus «peros»: «Quiero… pero…». Todas las razones por las que tu mente dice que no es posible.', hint: 'Ejemplos: «pero el mercado está saturado», «pero soy demasiado mayor». Es tu mente intentando protegerte.' },
        { t: 'write', id: 'b', q: 'Ponle nota de 0 a 10 a cada pero según cuánto te lo crees. Quédate con los de 7 o más.' },
        { t: 'write', id: 'c', q: 'Para cada uno de esos, busca ejemplos de personas o situaciones que demuestren que no es una verdad absoluta.', hint: 'Cuando lo cuestionas, pierde fuerza. Buscar ejemplos cercanos (tu país, tu edad, tu situación) ayuda mucho.' },
        { t: 'write', id: 'd', q: 'De pequeña, ¿qué escuchaste, viste o viviste sobre el éxito? ¿Cómo ha podido afectar a lo que creas hoy?' },
        { t: 'audio', id: 'regresiva', text: 'Escucha la «Sanación regresiva». Solo observas, no tienes que revivir nada. Con una vez es suficiente por ahora. Después, descansa y trátate como una reina. Sigue con las preguntas de abajo solo cuando termines.' },
        { t: 'write', id: 'e', q: 'Después de la hipnosis: ¿qué tomas de consciencia tuviste? ¿Qué sientes diferente?' },
        { t: 'write', id: 'f', q: 'Escríbete una carta de amor: todas las razones por las que eres merecedora y capaz de conseguir lo que deseas.' },
      ],
    },
    {
      d: 5, title: 'Ser quien ya lo tiene', time: '45–60 min',
      why: 'Primero se es, luego se hace y después se tiene. Hoy conoces a la versión de ti que ya vive lo que deseas.',
      steps: [
        { t: 'write', id: 'a', q: '¿Quién eres cuando ya lo has conseguido? Cómo piensa, cómo actúa, qué decide, qué ya no tolera, qué lee, cómo pasa su tiempo libre, cómo se habla.', hint: 'Escribe sobre ella como si la conocieras.' },
        { t: 'write', id: 'b', q: 'Ponle un nombre a esa versión de ti.', hint: 'El nombre ayuda a encarnarla. Maïté llamaba a la suya «The Boss».' },
        { t: 'write', id: 'c', q: '¿Cuáles son las 3 emociones principales que siente? ¿Cómo se trata cuando no está en ellas?' },
        { t: 'do', text: 'Ritual del cuerpo: ponte en sus zapatos, literalmente si puedes. Camina, muévete y habla como ella durante 2 minutos. El cuerpo enseña al sistema lo que es posible.' },
        { t: 'audio', id: 'memorias', text: 'Escucha las «Memorias futuras». Dejan en tu mente el recuerdo de tu éxito como si ya hubiera pasado.' },
        { t: 'write', id: 'd', q: '¿Qué recuerdos, imágenes o sensaciones surgieron?' },
      ],
    },
    {
      d: 6, title: 'Elevar y actuar', time: '30–45 min',
      why: 'Tu estado lo es todo. Desde ahí eliges una acción pequeña y real, no desde la urgencia.',
      steps: [
        { t: 'do', text: 'Elige una de las 3 emociones de ayer y date 5 o 10 minutos para sentirla. Tres caminos: revivir un recuerdo en el que ya la sentiste, usar el cuerpo (postura, sonrisa, movimiento) o hacer algo que te lleve a ella (yoga, música, naturaleza).', more: ['Si se hace demasiado, déjalo en 5 minutos.', 'Si te vienen pensamientos limitantes, no te exijas: dile a tu sistema «estamos a salvo» y sigue poco a poco.'] },
        { t: 'write', id: 'a', q: '¿Qué emoción elegiste y cómo la nutriste? ¿Cómo te sentiste?' },
        { t: 'do', text: 'Ponte en sus zapatos, adopta su estado emocional y pregúntate: ¿qué haría ella hoy?' },
        { t: 'write', id: 'b', q: 'Elige UNA acción concreta para las próximas 24 horas que te acerque a tu objetivo.', hint: 'Si es grande, al menos prográmala con fecha. Mejor hecho que perfecto.' },
        { t: 'do', text: 'Haz esa acción hoy, o deja puesta la fecha en tu calendario.' },
      ],
    },
    {
      d: 7, title: 'Soltar y sellar', time: '60–75 min',
      why: 'Haces tu parte con todo tu corazón y le dejas el resto al universo. Y plantas pocos hábitos para sostenerlo.',
      steps: [
        { t: 'write', id: 'a', q: 'Haz dos columnas: «Me encargo yo» (lo que haré con todo mi corazón) y «Se encarga el universo» (el cómo y el cuándo).', hint: 'Soltar no es abandonar: es dejar de apegarte al resultado de lo que haces.' },
        { t: 'write', id: 'b', q: 'Elige pocos hábitos, solo los justos para que se vuelvan automáticos y sostengan tu año.' },
        { t: 'write', id: 'c', q: 'Escoge una palabra y una frase que definan el año que vas a vivir.' },
        { t: 'write', id: 'd', q: '¿Cómo puedes enamorarte más de tu vida tal y como es hoy? ¿Cuántas veces te ha llegado ayuda inesperada?', hint: 'El amor y la gratitud no pueden convivir con el control.' },
        { t: 'audio', id: 'adn', adn: true, text: 'Escucha la «Activación de ADN». No tienes que hacer nada, solo dejarte guiar. Si te duermes, no pasa nada. Los días siguientes, bebe mucha agua y mímate.' },
        { t: 'do', text: 'Ritual de intención con vela (unos 20 minutos). Lo hace Maïté cada vez que tiene un objetivo nuevo.', more: [
          'Necesitas: una vela, cerillas, algo para limpiar el espacio (incienso, salvia o palo santo), una hoja y un bolígrafo.',
          '1. Busca un lugar donde nadie te moleste y pon música que te eleve.',
          '2. Limpia el espacio y a ti misma pasando el humo cerca del corazón, el vientre y la base de la columna, respirando lento.',
          '3. Manos en el pecho, ojos cerrados. Imagina a quienes más amas y di en voz alta: «Mi intención es manifestar…». Deja que salga sola.',
          '4. Escríbela en la hoja y fírmala con tu nombre, la fecha y el lugar. Por detrás: «Esto o algo aún mejor, para el mayor bien de todos. Hecho está. Gracias».',
          '5. Enciende la vela y lee en voz alta tu compromiso: darás lo mejor de ti, confiarás en los tiempos y soltarás el cómo y el cuándo.',
          '6. Apaga la vela sin soplar. Guarda el papel y vuelve a encontrarlo dentro de unos meses.',
        ] },
        { t: 'write', id: 'e', q: 'Antes de cerrar: ¿cuáles fueron tus mayores tomas de consciencia? ¿Qué es posible para ti ahora? ¿Qué te ilusiona más del futuro?' },
      ],
    },
  ],

  // Rutina de cada día (no es un ciclo: es para siempre)
  ROUTINES: {
    manana: {
      title: 'Tu mañana', time: '15–30 min',
      why: 'Empezar el día con calma le enseña a tu sistema que está a salvo y puede abrirse.',
      steps: [
        { t: 'audio', id: 'exito', text: 'Escucha la meditación «Éxito Cuántico».' },
        { t: 'write', id: 'm1', q: 'Hoy elijo sentir… y mi intención es…', hint: 'Elige una de las 3 emociones de tu versión exitosa.' },
      ],
    },
    dia: {
      title: 'Durante el día', time: '2 min, las veces que quieras',
      why: 'Tus afirmaciones y tu versión exitosa son tu brújula cuando dudas.',
      steps: [
        { t: 'aff' },
        { t: 'do', text: 'Cuando dudes, pregúntate: ¿qué haría ella? ¿Cómo se lo tomaría? ¿Qué pensaría?' },
        { t: 'write', id: 'd1', q: 'Un momento de hoy en el que actué como mi versión exitosa.', hint: 'Aunque sea pequeño.' },
      ],
    },
    noche: {
      title: 'Tu noche', time: '15 min',
      why: 'Cerrar el día con tapping y gratitud suelta la carga y entrena a tu cerebro a ver lo que sí funcionó.',
      steps: [
        { t: 'tap' },
        { t: 'write', id: 'g1', q: 'Tres cosas por las que estoy agradecida hoy.', hint: 'Concretas y específicas.' },
        { t: 'write', id: 'g2', q: 'Una persona que me inspira gratitud, y por qué.' },
        { t: 'write', id: 'g3', q: 'Algo que doy por sentado y por lo que estoy profundamente agradecida.' },
        { t: 'write', id: 'g4', q: 'Una gratitud por el futuro, como si ya lo hubiera recibido.', hint: 'Escríbelo en presente y siéntelo.' },
        { t: 'audio', id: 'diaria', opt: true, text: 'Si quieres, termina con la «Hipnosis diaria». Maïté recomienda escucharla al menos 21 días seguidos después de tu primer ciclo.' },
      ],
    },
  },
};
