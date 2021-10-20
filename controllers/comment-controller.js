const { Comment, Pizza } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } },
                    { new: true, runValidators: true }
                );
            })
            .then(pizzaData => {
                if(!pizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id' });
                    return;
                }
                res.json(pizzaData);
            })
            .catch(err => res.json(err));
    },

    addReply({ params, body}, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: {replies: body } },
            { new: true, runValidators: true }
        )
            .then(pizzaData => {
                if(!pizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id' });
                    return;
                }
                res.json(pizzaData);
            })
            .catch(err => res.json(err));
    },

    removeComment({ params }, res) {   
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if(!deletedComment) {
                    res.status(404).json({ message: 'No comment with this id' });
                    return;
                }

                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(pizzaData => {
                if(!pizzaData) {
                    res.status(404).json({ message: 'No pizza with this id' });
                    return;
                }
                res.json(pizzaData);
            })
            .catch(err => res.json(err));
    },

    removeReply({ params }, res) {
        Comment.findOneAndDelete(
            { _id: params.commentId },
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
            .then(pizzaData => {
                res.json(pizzaData);
            })
            .catch(err => res.json(err));
    }
}

module.exports = commentController;