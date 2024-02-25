const express = require('express');
const { getTodo, saveTodo, updateTodo, deleteTodo } = require('../controllers/TodoController');
const router = express.Router();

const extractIdFromParams = (req, res, next) => {
    // Extract 'id' from the params and add it to the body
    const todoId = req.params.id;
    req.body._id = todoId;
    next();
};

router.get('/', getTodo)
router.post('/save', saveTodo)
router.post('/update/:id', extractIdFromParams, updateTodo)
router.post('/delete/:id', extractIdFromParams, deleteTodo)



module.exports = router