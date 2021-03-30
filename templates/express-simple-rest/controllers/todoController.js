const {list} = require('../models/list');
// controller for /todo/all route
exports.displayAllController = function (req, res) {
    res.status(200).send(list);
}

// controller for /todo/completed route
exports.displayCompletedController = function (req, res) {
    let completed = [];
    for (i in list) {
        let task = list[i];
        if (task.finished) completed.push(task);
    }
    res.status(200).send(completed);
}
// controller for /todo/unfinished route
exports.displayUnfinishedController = function (req, res) {
    let unfinished = [];
    for (i in list) {
        let task = list[i];
        if (!(task.finished)) unfinished.push(task);
    }
    res.status(200).send(unfinished);
}

// controller for /todo/:taskid route
exports.displaySpecificController = function (req, res) {
    for (i in list) {
        let task = list[i];
        let reqId = req.params.taskid;
        // notice: used == rather than === because taskid from url is string
        // and from list is a number.
        if (task.id == reqId){
            res.status(200).send(task);
            return;
        }
    }
    res.status(404).send({err:"404",msg:"no such task"});
}