const express = require('express');
const router = express.Router();
var mentor = require("../module/teacher")
router.get('/',mentor.getMentors);
router.get('/WOS',mentor.MentorWithoutStudents)
router.get('/:id',mentor.getMentor);
router.post("/create",mentor.createMentor);
router.put('/modify/:id',mentor.updateMentor);
router.delete('/delete/:id',mentor.deleteMentor);
router.patch('/:id/assign/student',mentor.assignStudent)                    
module.exports = router;