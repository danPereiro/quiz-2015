var path = require('path');

//adaptamos modelo a despliegue en heroku
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = (url[6]||null);
var user      = (url[2]||null);
var pwd       = (url[3]||null);
var protocol  = (url[1]||null);
var dialect   = (url[1]||null);
var port      = (url[5]||null);
var host      = (url[4]||null);
var storage   = process.env.DATABASE_STORAGE;

//esto carga el modelo ORM
var Sequelize = require('sequelize');

//Elegimos que BBDD usamos
var sequelize = new Sequelize(DB_name,user,pwd,
  { dialect:   protocol,
    protocol:  protocol,
    port:      port,
    host:      host,
    storage:   storage, //solo SQLite (.env)
    omitNull:  true, //solo Postgres
    native:    true
  }
);

//Importamos la definicion de la tabla QUIZ en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

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
