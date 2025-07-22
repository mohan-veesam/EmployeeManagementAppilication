// backend/controllers/employeeController.js
const db = require('../config/db');

// Get all employees
// exports.getAllEmployees = (req, res) => {
//   db.query('SELECT * FROM employees', (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.json(results);
//   });
// };

// Get all employee skills
// exports.getEmployeeSkills = (req, res) => {
//   db.query('SELECT * FROM employee_skills', (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.json(results);
//   });
// };

// Add new employee
// exports.addEmployee = (req, res) => {
//   const { saturation, fullname, phone, email } = req.body;

//   if (!saturation || !fullname || !phone || !email) {
//   return res.status(400).json({ error: "All fields are required" });
//   }
//   const query = 'INSERT INTO employees (saturation, fullname, phone, email) VALUES (?, ?, ?, ?)';
//   db.query(query, [saturation, fullname, phone, email], (err, result) => {
//     if (err) return res.status(500).send(err);
//     res.json({ message: 'Employee added', id: result.insertId });
//   });
// };

exports.addEmployee = (req, res) => {
  const { saturation, fullname, phone, email, skills } = req.body;

  if (!saturation || !fullname || !phone || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = 'INSERT INTO employees (saturation, fullname, phone, email) VALUES (?, ?, ?, ?)';
  db.query(query, [saturation, fullname, phone, email], (err, result) => {
    if (err) return res.status(500).send(err);

    const employeeId = result.insertId;

    // Check if skills are provided and valid
    if (Array.isArray(skills) && skills.length > 0) {
      const skillValues = skills.map(skill => [employeeId, skill.technology, skill.level]);

      const skillQuery = 'INSERT INTO employee_skills (employee_id, technology, level) VALUES ?';

      db.query(skillQuery, [skillValues], (skillErr) => {
        if (skillErr) return res.status(500).json({ error: 'Error inserting skills' });
        return res.json({ message: 'Employee and skills added successfully' });
      });
    } else {
      // No skills provided, just return employee created
      return res.json({ message: 'Employee added without skills', id: employeeId });
    }
  });
};

// Update employee
exports.updateEmployee = (req, res) => {
  const { fullname, phone, email } = req.body;
  const id = req.params.id;
  const query = 'UPDATE employees SET saturation = ?, fullname = ?, phone = ?, email=? WHERE id = ?';
  db.query(query, [saturation, fullname, phone, email, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Employee updated' });
  });
};

// Delete employee
exports.deleteEmployee = (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM employees WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Employee deleted' });
  });
};

exports.getAllEmployees = (req, res) => {
  const employeeQuery = 'SELECT * FROM employees';
  const skillsQuery = 'SELECT * FROM employee_skills';

  db.query(employeeQuery, (err, employees) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Failed to fetch employees' });
    }

    db.query(skillsQuery, (err, skills) => {
      if (err) {
        console.error('Error fetching skills:', err);
        return res.status(500).json({ error: 'Failed to fetch skills' });
      }

      const employeesWithSkills = employees.map(emp => {
        const empSkills = skills.filter(skill => skill.employee_id === emp.id);
        return {
          ...emp,
          skills: empSkills
        };
      });

      res.status(200).json(employeesWithSkills);
    });
  });
};
