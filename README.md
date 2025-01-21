# How to Clone and Start the Project

This guide will walk you through the steps to clone this project from a repository and start it on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

## Steps to Clone and Start the Project

#### 1. Clone the Repository

1. Open your terminal or command prompt.
2. Navigate to the directory where you want to clone the project.
3. Run the following command to clone the repository:

   ```bash
   git clone https://github.com/FluxDevsTeam/KidsDesignCompanyFrontend.git
   ```

4. Navigate to the cloned project directory:

   ```bash
   cd KidsDesignCompanyFrontend
   ```

#### 2. Install Dependencies

1. Ensure you are in the project directory.
2. Install the project dependencies by running:

   ```bash
   npm install
   ```

#### 3. Start the Project

1. Once the dependencies are installed, start the project by running:

   ```bash
   npm run dev
   ```

2. Open your browser and go to the specified URL (e.g., `http://localhost:5173`).

### Troubleshooting

- **Missing Dependencies:** If you encounter missing dependencies, re-run `npm install`.
- **Unknown Start Command:** Double-check the `scripts` section of the `package.json` file.

### Additional Commands

- **Build the Project:**

  ```bash
  npm run build
  ```

- **Install a Specific Dependency:**

  ```bash
  npm install <package-name>
  ```

### Conclusion

You have now successfully cloned and started the project!.
