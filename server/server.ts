import express, { type Request, type Response } from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper to get data file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'employees.json');

// Types
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
}

// Helper functions
async function readData(): Promise<Employee[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

async function writeData(data: Employee[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes

// GET /api/employees
app.get('/api/employees', async (req: Request, res: Response) => {
  try {
    let employees = await readData();
    const { search, sort, order } = req.query;

    // Search
    if (search) {
      const searchLower = (search as string).toLowerCase();
      employees = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (sort) {
      const sortKey = sort as keyof Employee;
      const sortOrder = order === 'desc' ? -1 : 1;
      
      employees.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return -1 * sortOrder;
        if (a[sortKey] > b[sortKey]) return 1 * sortOrder;
        return 0;
      });
    }

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST /api/employees
app.post('/api/employees', async (req: Request, res: Response) => {
  try {
    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      ...req.body
    };
    
    const employees = await readData();
    employees.push(newEmployee);
    await writeData(employees);
    
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT /api/employees/:id
app.put('/api/employees/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const employees = await readData();
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Employee not found' });
      return; // Ensure we return here
    }
    
    employees[index] = { ...employees[index], ...updates };
    await writeData(employees);
    
    res.json(employees[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE /api/employees/:id
app.delete('/api/employees/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employees = await readData();
    const filteredEmployees = employees.filter(emp => emp.id !== id);
    
    if (employees.length === filteredEmployees.length) {
      res.status(404).json({ error: 'Employee not found' });
      return; // Ensure we return here
    }
    
    await writeData(filteredEmployees);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
