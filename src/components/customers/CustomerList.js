import { useEffect, useState } from "react"
import { Customer } from "./customer"
import "./customers.css"
export const CustomerList = () =>{
    const [customers, setCustomers] = useState([])

    useEffect(
        () => {
            fetch(`http://localhost:8088/users?isStaff=false`)
            .then(response => response.json())
            .then((customerArr)=>{
                setCustomers(customerArr)
            })
        },
        []
    )

    return <article className="customers">
    {
        customers.map(customer =>  <Customer key={`customer--${customer.id}`} 
        id={customer.id} 
        fullName={customer.fullName} 
        email={customer.email} />)
        }
    
    </article>
}
