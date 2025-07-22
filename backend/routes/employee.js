const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeController');

router.get('/', controller.getAllEmployees);
router.post('/', controller.addEmployee);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
