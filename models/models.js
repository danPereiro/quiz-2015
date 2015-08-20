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
    omitNull:  true //solo Postgres
  }
);

//Importamos la definicion de la tabla QUIZ en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importamos la definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

//relacionamos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//exportamos la definicion
exports.Quiz = Quiz;
exports.Comment = Comment;

//creamos e inicializamos la tabla de preguntas
sequelize.sync().then(function() {
  //en exito ejecuta el manejador
  Quiz.count().then(function (count) {
    if (count === 0) {
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma',
                    tema: 'otro'
                  });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa',
                    tema: 'otro'
                  })
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});
