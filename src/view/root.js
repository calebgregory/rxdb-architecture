const vorpal = require('vorpal')()

vorpal.command('show jobs list', 'list jobs that belong to you')
  .action(function(args, cb) {
    this.log(args)
    cb()
  })

vorpal.command('show job <job_id>', 'show a job')
  .action(function(args, cb) {
    this.log(args)
    cb()
  })

vorpal.command('list job_contents <job_id>', 'list content on a job')
  .action(function(args, cb) {
    this.log(args)
    cb()
  })


let ctr = 0;
function draw() {
  vorpal.ui.redraw('\n\n' + Math.random() + '\n\n');
  if (ctr < 10) {
    ctr++;
    setTimeout(function (){
      draw();
      vorpal.ui.redraw.done();
    }, 3000)
  }
}
draw();

vorpal.delimiter("(>'')>").show()
