const { vorpal } = require('./renderer')
const { app } = require('~/src/app')

// @todo
vorpal.command('show content <content_id>', 'show a content')
  .action(function(args, cb) {
    this.log(args)
    cb()
  })