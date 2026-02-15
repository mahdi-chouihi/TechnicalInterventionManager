const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let interventions = [];
let idCounter = 1;

/*
Intervention Model:
{
  id: number,
  title: string,
  description: string,
  technician: string,
  status: "To Do" | "In Progress" | "Done"
}
*/

// ADMIN: Create intervention
app.post("/interventions", (req, res) => {
  const { title, description, technician } = req.body;

  const newIntervention = {
    id: idCounter++,
    title,
    description,
    technician,
    status: "To Do"
  };

  interventions.push(newIntervention);
  res.json(newIntervention);
});

// TECHNICIAN: Get assigned interventions
app.get("/interventions/:technician", (req, res) => {
  const { technician } = req.params;

  const assigned = interventions.filter(
    i => i.technician === technician
  );

  res.json(assigned);
});

// TECHNICIAN: Update status
app.put("/interventions/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validTransitions = {
    "To Do": "In Progress",
    "In Progress": "Done"
  };

  const intervention = interventions.find(i => i.id == id);

  if (!intervention) {
    return res.status(404).json({ message: "Not found" });
  }

  if (validTransitions[intervention.status] !== status) {
    return res.status(400).json({
      message: `Invalid status transition from ${intervention.status} to ${status}`
    });
  }

  intervention.status = status;
  res.json(intervention);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
