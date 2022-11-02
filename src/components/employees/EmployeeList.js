import { useEffect, useState } from "react"
import { Employee } from "./employee"
import "./employees.css"
export const EmployeeList = () =>{
    const [employees, setEmployees] = useState([])

    useEffect(
        () => {
            fetch(`http://localhost:8088/users?isStaff=true`)
            .then(response => response.json())
            .then((empArr)=>{
                setEmployees(empArr)
            })
        },
        []
    )

    return <article className="employees">
    {
        employees.map(employee =>  <Employee key={`employee--${employee.id}`} 
        id={employee.id} 
        fullName={employee.fullName} 
        email={employee.email} />)
        }
    
    </article>
}
