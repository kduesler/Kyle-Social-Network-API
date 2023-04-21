const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .populate("thoughts")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and associated apps
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({ message: "User and associated thoughts deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },

  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: { _id: req.params.friendId } } },
      { runValidators: true, new: true }
    )
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // deleteFriend(req, res) {
  //   User.findOneAndUpdate(
  //     { _id: req.params.userId },
  //     { $set: req.body },
  //     { runValidators: true, new: true }
  //   )
  //     .then((user) => {
  //       !user
  //         ? res.status(404).json({ message: "No user with that ID" })
  //         : res.json(user);
  //     })
  //     .catch((err) => res.status(500).json(err));
  // },

  deleteFriend(req, res) {
    User.findOneAndRemove({ _id: req.params.friendId })
      .then((friend) =>
        !friend
          ? res.status(404).json({ message: 'No friend with this id!' })
          : User.findOneAndUpdate(
              { friends: req.params.friendId },
              { $pull: { friends: req.params.friendId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'No user with this id!',
            })
          : res.json({ message: 'Friend successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },
};
