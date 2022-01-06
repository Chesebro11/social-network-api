const { Thought, User } = require('../models');
const { db } = require('../models/User');

const thoughtController = {

    getThoughts(req, res) {
        Thought.find()
        .sort({ createdAt: -1 })
        .then((dbThoughtData) => {
            res.json(dbThoughtData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },

    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    },

    addThought(req, res) {
        Thought.create(req.body)
        .then((dbThoughtData) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json({ message: 'Thought created' });
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    },

    removeThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
            return User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: {thoughts: params.thoughtId } },
                { new: true }
            );
        })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({ message: 'This thought has been deleted' })
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    },

    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
            return res.status(404).json({ message: 'No thought with this id' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },

    remmoveReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },
};

module.exports = thoughtController;