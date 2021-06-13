const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// get all posts
router.get('/' , (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'title',
      'post_contents',
      'created_at'
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
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// get one post
router.get('/:id', (req, res) => {
  Post.findOne({
    where: { id: req.params.id },
    attributes: [
      'id',
      'title',
      'post_contents',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found!' })
      }
      res.json(dbPostData)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// create posts
router.post('/', (req, res) => {
  Post.create({
    title: req.body.title,
    post_contents: req.body.post_contents,
    user_id: req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// update posts by id
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title,
      post_contents: req.body.post_contents
    },
    {
      where: { id: req.params.id }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found!' })
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

// delete posts by id
router.delete('/:id', (req, res) => {
  Post.destroy(
    {
      where: { id: req.params.id }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found!' })
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

module.exports = router;