const { query } = require("express");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");
const User = require("../models/user");

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const sort = {};
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.status(201).send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({
      _id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});
router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    user: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const taskKeys = Object.keys(req.body);
  const updateParams = ["description", "completed"];
  const isValidOperation = taskKeys.every((task) =>
    updateParams.includes(task)
  );
  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    // const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send();
    }
    taskKeys.forEach((key) => (task[key] = req.body[key]));
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      res.status(404).send();
    }

    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
