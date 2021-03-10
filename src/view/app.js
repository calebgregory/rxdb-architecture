/*
actions
- list jobs
- list job-content <job-id>
*/

const vorpal = require('vorpal')()

vorpal.command('list jobs', 'list jobs that belong to you')
  .action(function(args, cb) {
    this.log(args)
    cb()
  })

vorpal.command('list job-contents <job-id>', 'list content on a job')
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
