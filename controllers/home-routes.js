const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res, next) => {
  Post.findAll({
    attributes: [
      'id',
      'title',
      'post_content',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // grab the plain json from the datas
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

router.get('/:id', (req, res, next) => {
  Post.findAll({
    where: { id: req.params.id },
    attributes: [
      'id',
      'title',
      'post_content',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // grab the plain json from the datas
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

router.get('/login', (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  // load handlebars templates
  res.render('login');
})

module.exports = router;
