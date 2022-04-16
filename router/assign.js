const express = require('express');
const router = express.Router();
const assignMentor = require('../module/assing')
router.create("/",assignMentor.assignMentorForStudent)