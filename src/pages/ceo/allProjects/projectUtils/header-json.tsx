import { nanoid } from "nanoid";

export interface Task {
  name: string;
  email: string;
  id:number; 
  quantity: number;
<<<<<<< HEAD
  status: 'In Progress' | 'Cancelled';
=======
  status: 'Active' | 'Cancelled' | 'Completed';
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
  startDate: string; 

}

<<<<<<< HEAD
export const projectSummary = [
=======
export interface Project {
  name: string;
  email: string;
  order:string
  id:number; 
  orderNo: string;

}
export interface Ptask {
  name: string;
  desc: string;
  id:number; 
  status: 'Active' | 'Cancelled' | 'Completed';
  startDate: string;
  endDate:string; 

}

export interface Product {
  name: string;
  desc: string;
  id:number; 
  cost:number;
  selling:number;
  expense:number
  startDate: string;
  endDate:string; 

}
export interface ProjectSummary {
  id: string;
  type: string;
  number: number;
  description: string;
  path?: string; 
}


{/*Data for the main dashbooard header*/}
export const projectSummary: ProjectSummary[] = [
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
  {
    id: nanoid(),
    type: "Total Projects",
    number: 150,
    description: "This is the total number of projects tracked in the system.",
<<<<<<< HEAD
=======
    path: "/dashboard/all-projects",
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
  },
  {
    id: nanoid(),
    type: "Active Projects",
    number: 45,
    description: "These are the projects currently in progress.",
<<<<<<< HEAD
=======
    path: "/dashboard/active-projects",
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
  },
  {
    id: nanoid(),
    type: "Completed",
    number: 90,
    description: "Projects that have been successfully completed.",
<<<<<<< HEAD
=======
    path: "/dashboard/completed-projects", // Added path for consistency
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
  },
  {
    id: nanoid(),
    type: "Cancelled",
    number: 15,
    description: "These projects were cancelled before completion.",
<<<<<<< HEAD
  },
];

=======
    path: "/dashboard/cancelled-projects",
  },
];

{/*Data for projects table dashboard*/}
export const project: Project[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    id:52443,
    orderNo:"tw6w76w",
    order:"Ann"
    
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    id: 64649,
    orderNo:"tw6w7te6w",
    order:"Acdon"
   
  },
  {
    name: "Michael Ebo Andorful",
    email: "michael.andorful@example.com",
    id: 74744,
    orderNo:"wds6w76w",
    order:"Bye"
   
  },
  {
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    id: 74536,
    orderNo:"ttew6w76w",
    order:"Mike"
   
  },
  {
    name: "Tom Hanks",
    email: "tom.hanks@example.com",
    id: 84747,
    orderNo:"tytew6w76w",
    order:"sike"
   
  },
  {
    name: "Bruce Wayne",
    email: "brucewaynes@example.com",
    id: 64647,
    orderNo:"ters6w76w",
    order:"Grinch"
   
  },
]

{/* Data for total number of users on the dashboard table*/}
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
export const users: Task[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    id:52443,
    quantity: 10,
<<<<<<< HEAD
    status: "In Progress",
=======
    status: "Active",
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
    startDate: "2024-01-01",
    
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    id: 64649,
    quantity: 20,
<<<<<<< HEAD
    status: "In Progress",
=======
    status: "Active",
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
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
<<<<<<< HEAD
    status: "In Progress",
=======
    status: "Active",
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
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
<<<<<<< HEAD
    id: 53245,
    quantity: 47,
    status: "In Progress", 
=======
    id: 5,
    quantity: 47,
    status: "Completed", 
    startDate: "2024-05-05",
 
  },
  {
    name: "Tom Hanks",
    email: "tom.hanks@example.com",
    id: 847,
    quantity: 40,
    status: "Completed", 
    startDate: "2024-05-05",
   
  },
  {
    name: "Bruce Wayne",
    email: "brucewaynes@example.com",
    id: 646,
    quantity: 66,
    status: "Completed", 
    startDate: "2024-05-05",
   
  },
  {
    name: "Tom Holland",
    email: "tomholland.hanks@example.com",
    id: 53245,
    quantity: 47,
    status: "Completed", 
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
    startDate: "2024-05-05",
 
  },
 
];

<<<<<<< HEAD
=======
{/* Data for transactions on the min dashboard */}
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
export const transactions = [
{
  text: "Groceries",
  date: new Date("2024-12-12"),
  price: 50.75
},

 {
  text: "Movie Ticket",
  date: new Date("2024-11-15"),
  price: 12.99
},

{
  text: "Book Purchase",
  date: new Date("2024-10-25"),
  price: 19.49
}
]
<<<<<<< HEAD
=======


{/* Data for list of active projects */}
export const projects: Ptask[] = [
  {
    name: "John Doe",
    desc: "john.doe@example.com",
    id:52443,
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-01-01",
    
  },
  {
    name: "Jane Smith",
    desc: "jane.smith@example.com",
    id: 64649,
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-02-15",
   
  },
  {
    name: "Michael Ebo Andorful",
    desc: "michael.andorful@example.com",
    id: 74744,
    status: "Cancelled", 
    startDate: "2024-03-10",
    endDate: "2024-01-01",
   
  },
  {
    name: "Sarah Connor",
    desc: "sarah.connor@example.com",
    id: 74536,
    status: "Completed",
    startDate: "2024-04-25",
    endDate: "2024-01-01",
   
  },]

  {/* Data for list of projects */}
  export const products: Product[] = [
    {
      name: "John Doe",
      desc: "john.doe@example.com",
      id:52443,
      expense: 322,
      selling:4873,
      cost:4252,
      startDate: "2024-01-01",
      endDate: "2024-01-01",
      
    },
    {
      name: "Jane Smith",
      desc: "jane.smith@example.com",
      id: 64649,
      expense: 322,
      selling:4873,
      cost:4252,
      startDate: "2024-01-01",
      endDate: "2024-02-15",
     
    },
    {
      name: "Michael Ebo Andorful",
      desc: "michael.andorful@example.com",
      id: 74744,
      expense: 322,
      selling:4873,
      cost:4252,
      startDate: "2024-03-10",
      endDate: "2024-01-01",
     
    },
    {
      name: "Sarah Connor",
      desc: "sarah.connor@example.com",
      id: 74536,
      expense: 322,
      selling:4873,
      cost:4252,
      startDate: "2024-04-25",
      endDate: "2024-01-01",
     
    },]
>>>>>>> 036240c2fb37e93e51d62f12c2729847278bb274
