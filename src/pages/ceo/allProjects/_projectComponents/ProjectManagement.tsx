

import { useState } from "react"
import ProjectsHeader from "./ProjectsHeader"
import UserTable from "./UserTable"
import { users } from "../_projectUtils/header-json"

export default function ProjectManagement() {
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [activeFilter, setActiveFilter] = useState("Total Projects")

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType)
    if (filterType === "Total Projects") {
      setFilteredUsers(users)
    } else {
      const status = filterType === "Active Projects" ? "Active" : filterType
      const filtered = users.filter((user) => user.status === status)
      setFilteredUsers(filtered)
    }
  }

  return (
    <div>
      <ProjectsHeader onFilterClick={handleFilterClick} activeFilter={activeFilter} />
      <UserTable users={filteredUsers} title={activeFilter} />
    </div>
  )
}

