const { User, Thought } = require('../models');

const userController = {
    getUsers(req, res) {
        User.find()
        .select('-__v')
        .then((dbUserData) => {
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },

    getUserById(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this id' });
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },

    addUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => {
            res.json(dbUserData);   
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId },
            {
                $set: req.body,
            },
            {
                runValidators: true,
                new: true,
            }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with this id!' });
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },

    removeUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json ({ message: 'No user with this id' });
            }
        })
        .catch((err) => {
            res.status(500).json(err);
        })
    },

    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId },
            {$addToSet: {freinds: req.params.friendId } },
            {new: true })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this id' });
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },

    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, 
            {$pull: { friends: req.params.friendId } }, 
            { new: true })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found with this id' });
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
    },
};

module.exports = userController;