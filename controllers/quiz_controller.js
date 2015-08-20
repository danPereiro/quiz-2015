var models = require('../models/models.js');

//Autoload - para factorizar codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
      where: { id: Number(quizId)},
      include: [{model: models.Comment}]
    }).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error);});
};

exports.index = function(req, res) {
  if (req.query.search && req.query.search != "") {
    likeParam = "%" + (req.query.search).split(' ').join('%') + "%";
    models.Quiz.findAll(
      {where:["pregunta like ?",likeParam]}
    ).then(function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes, errors:[]});
    });
  } else {
    models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes, errors:[]});
    });
  }
};

//GET /quizes/:id
exports.show = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', {quiz: req.quiz, errors:[]});
  });
};

//Get para /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto'
  }
  res.render(
    'quizes/answer',
    {
      quiz: req.quiz,
      respuesta: resultado,
      errors: []
    });
};

exports.new = function(req, res) {
  var quiz = models.Quiz.build( //crea objeto quiz
    {pregunta:"Pregunta", respuesta:"Respuesta", tema:"Tema"}
  );
  res.render('quizes/new',{quiz:quiz, errors:[]});
};

//POST /quizes/create
exports.create = function(req,res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz
  .validate ()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new',{quiz: quiz, errors: err.errors});
      } else {
        quiz
        .save({fields:["pregunta", "respuesta", "tema"]})
        .then(function(){res.redirect('/quizes')})
      }
    }
  )
};

//GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      }
    }
  );
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

/* Viejo codigo para funcionamiento con una sola pregunta
//Get para /quizes/question
exports.question = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    res.render('quizes/question', {pregunta: quiz[0].pregunta});
  });
};

//Get para /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
    if(req.query.respuesta === quiz[0].respuesta) {
      res.render('quizes/answer', {respuesta: 'Correcto'});
    } else {
      res.render('quizes/answer', {respuesta: 'Incorrecto'});
    }
  });
};
*/
