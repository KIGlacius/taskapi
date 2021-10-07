const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewURLParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// const Task = mongoose.model("Task", {
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// });

// const task = new Task({
//   description: "   Task Two    ",
// });
