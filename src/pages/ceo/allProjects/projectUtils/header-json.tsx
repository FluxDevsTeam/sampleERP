import { nanoid } from "nanoid";

export interface Task {
  name: string;
  email: string;
  id:number; 
  quantity: number;
  status: 'In Progress' | 'Cancelled';
  startDate: string; 

}

export const projectSummary = [
  {
    id: nanoid(),
    type: "Total Projects",
    number: 150,
    description: "This is the total number of projects tracked in the system.",
  },
  {
    id: nanoid(),
    type: "Active Projects",
    number: 45,
    description: "These are the projects currently in progress.",
  },
  {
    id: nanoid(),
    type: "Completed",
    number: 90,
    description: "Projects that have been successfully completed.",
  },
  {
    id: nanoid(),
    type: "Cancelled",
    number: 15,
    description: "These projects were cancelled before completion.",
  },
];

export const users: Task[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    id:52443,
    quantity: 10,
    status: "In Progress",
    startDate: "2024-01-01",
    
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    id: 64649,
    quantity: 20,
    status: "In Progress",
    startDate: "2024-02-15",
   
  },
  {
    name: "Michael Ebo Andorful",
    email: "michael.andorful@example.com",
    id: 74744,
    quantity: 30,
    status: "Cancelled", // Fixed case mismatch
    startDate: "2024-03-10",
   
  },
  {
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    id: 74536,
    quantity: 15,
    status: "In Progress",
    startDate: "2024-04-25",
   
  },
  {
    name: "Tom Hanks",
    email: "tom.hanks@example.com",
    id: 84747,
    quantity: 40,
    status: "Cancelled", 
    startDate: "2024-05-05",
   
  },
  {
    name: "Bruce Wayne",
    email: "brucewaynes@example.com",
    id: 64647,
    quantity: 66,
    status: "Cancelled", 
    startDate: "2024-05-05",
   
  },
  {
    name: "Tom Holland",
    email: "tomholland.hanks@example.com",
    id: 53245,
    quantity: 47,
    status: "In Progress", 
    startDate: "2024-05-05",
 
  },
 
];
