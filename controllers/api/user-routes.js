const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../utils/auth');

// get all
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

// get one by id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: req.params.id },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_contents', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

// post users
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => {
      // req.session.save(() => {
      //   req.session.user_id = dbUserData.id;
      //   req.session.usename = dbUserData.username;
      //   req.session.loggedIn = true;
      // })
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update user creds
router.put('/:id', withAuth, (req, res) => {
  User.update(req.body, {
    // initialize hook hashing
    individualHooks: true,
    where: { id: req.params.id }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete users
router.delete('/:id', withAuth, (req, res) => {
  User.destroy({
    where: { id: req.params.id }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login post to create session for user after logging in
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with this email!'});
    }
    // verify User
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Wrong password!'});
      return;
    }
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.usename = dbUserData.username;
      req.session.loggedIn = true;
      res.json({ use: dbUserData, message: 'You are now logged in! :)' });
    })
  })
})

// logout post to end session
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

module.exports = router;