const express=require('express');
const router=express.Router();
const {displayAllController,displayCompletedController,displayUnfinishedController,displaySpecificController, displaySpecificControllers}=require('../controllers/todoController');

//for displaying all tasks
router.get('/all',displayAllController);

//for displaying completed task
router.get('/completed',displayCompletedController);

// for displaying unfinished task
router.get('/unfinished',displayUnfinishedController);

// for displaying specific task details
router.get('/:taskid',displaySpecificController);

module.exports=router;