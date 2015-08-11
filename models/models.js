var path = require('path');

//esto carga el modelo ORM
var Sequelize = require('sequelize');

//marcamos SQLite como bbdd
var sequelize = new Sequelize(null, null, null,
                      {dialect: 'sqlite', storage: 'quiz.sqlite'}
                );

//Importamos la definicion de la tabla QUIZ en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//exportamos la definicion
exports.Quiz = Quiz;

//creamos e inicializamos la tabla de preguntas
sequelize.sync().success(function() {
  //en exito ejecuta el manejador
  Quiz.count().success(function (count) {
    if (count === 0) {
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                  })
      .success(function(){console.log('Base de datos inicializada')});
    };
  });
});
