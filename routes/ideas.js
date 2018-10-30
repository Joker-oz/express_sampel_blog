var express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const {ensureAuthenticated} = require('../helpers/auth')

const router = express.Router()

// 引入模型
require('../models/Idea')

const Idea = mongoose.model('ideas')

// body-parser middleware
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/ideas', ensureAuthenticated, function (req, res) {
  Idea.find({user: req.user.id})
      .sort({date: 'desc'})
      .then(ideas => {
        res.render('ideas/index', {
          ideas: ideas
        })
      })
})

router.get('/ideas/add', ensureAuthenticated, function (req, res) {
  res.render('ideas/add')
})

router.get('/ideas/edit/:id', ensureAuthenticated, function (req, res) {
  Idea.findOne({
    _id: req.params.id
  })
  .then( idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', '非法操作~！')
      res.redirect('/ideas')
    } else {
      res.render('ideas/edit', {
        idea: idea
      })
    }
  })
})

// 添加
router.post('/ideas', urlencodedParser, function (req, res) {
  let errors = []
  if (!req.body.title) {
    errors.push({text: "请输入标题"})
  }
  if (!req.body.details) {
    errors.push({text: "请输入详情"})
  }
  if(errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser).save()
                     .then(idea => {
                      req.flash('success_msg', '数据添加成功')
                      res.redirect('/ideas')
                     })
  }
  // res.render('ideas/add')
})


// 编辑
router.put('/ideas/:id', urlencodedParser, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    idea.title = req.body.title,
    idea.details = req.body.details
    idea.save()
        .then(idea => {
          req.flash('success_msg', '数据编辑成功')
          res.redirect('/ideas')
        })
  })
})

// 删除
router.delete('/ideas/:id', urlencodedParser, ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('success_msg', '数据删除成功')
    res.redirect('/ideas')
  })
})

module.exports = router
