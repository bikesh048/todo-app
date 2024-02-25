const { body, validationResult } = require('express-validator');
const TodoModel = require("../models/TodoModel")

module.exports.getTodo = async (req, res) => {
    const { query } = req;

    // Define filter options based on query parameters
    const filterOptions = {};

    if (query.completed) {
        filterOptions.completed = query.completed === 'true'; // return only completed true and in other case return completed false
    }


    const todos = await TodoModel.find(filterOptions)
    res.render('index', {todos})
}


module.exports.saveTodo = [
    // Validation middleware using express-validator
    body('text')
        .trim()
        .isLength({ min: 6, max: 100 })
        .withMessage('Text must be between 6 and 100 characters'),

    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(error => error.msg);

                return res.status(400).render('error', { message: errorMessages  });
            }

            console.log('req', req.body);
            const { text } = req.body;

            const newTodo = await TodoModel.create({ text });

            console.log('Added Successfully ..');
            console.log(newTodo);

            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'Internal Server Error' });        }
    }
];



module.exports.updateTodo = [
    // Validation middleware using express-validator
    body('text')
        .trim()
        .isLength({ min: 6, max: 100 })
        .withMessage('Text must be between 6 and 100 characters'),

    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { _id, text, completed } = req.body;
            console.log('req', req.body);

            const updatedTodo = await TodoModel.findByIdAndUpdate(_id, { text, completed }, { new: true });

            console.log("Updated Successfully ..", updatedTodo);

            res.status(200).send({ updatedTodo });

        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
];


module.exports.deleteTodo = async (req, res) => {
    try {
        const { _id } = req.body;

        await TodoModel.findByIdAndDelete(_id);

        console.log("Deleted Successfully ..");
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

