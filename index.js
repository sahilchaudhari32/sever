const users = [
  { id: 1, name: "Arjun", role: "student" },
  { id: 2, name: "Priyesha", role: "mentor" }
];

const express = require("express");
const app = express();

app.listen(2000, () => {
  console.log("Server is running on port 2000");
});

app.get("/", (req, res) => {
  res.status(200).json(users);
});


// app.get("/", (req, res) => {
//   const userId = Number(req.params.id);
//   const user = users.find(u => u.id === userId);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.status(200).json(user);
// });


