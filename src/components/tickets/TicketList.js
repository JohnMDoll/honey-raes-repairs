import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Ticket } from "./Ticket"
import "./Tickets.css"

export const TicketList = ({ searchTermState }) => {
    const [tickets, setTickets] = useState([])
    const [employees, setEmployees] =useState([])
    const [filteredTickets, setFilter] = useState([])
    const [emergency, setEmergency] = useState(false)
    const [openOnly, updateOpenOnly] = useState(false)
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
            const searchedTickets = tickets.filter(ticket => {
                return ticket.description.toLowerCase().includes(searchTermState.toLowerCase())
            })
            setFilter(searchedTickets)
        },
        [searchTermState]
    )
    useEffect(
        () => {
            if (emergency) {
                const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
                setFilter(emergencyTickets)
            }
            else {
                setFilter(tickets)
            }
        },
        [emergency]
    )

    const getAllTickets = () => {
        fetch(`http://localhost:8088/serviceTickets?_embed=employeeTickets`)
                .then(res => res.json())
                .then((ticketArray) => {
                    setTickets(ticketArray)
                })
    }
    useEffect(
        () => {
            // console.log("Initial state of tickets", tickets) // View the initial state of tickets
            fetch(`http://localhost:8088/serviceTickets?_embed=employeeTickets`)
                .then(res => res.json())
                .then((ticketArray) => {
                    setTickets(ticketArray)
                })

                fetch(`http://localhost:8088/employees?_expand=user`)
                .then(res => res.json())
                .then((employeeArray) => {
                    setEmployees(employeeArray)
                })
        },
        [] // When this array is empty, you are observing initial component state
    )
    useEffect(
        () => {
            if (honeyUserObject.staff) {
                setFilter(tickets)
            }
            else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFilter(myTickets)
            }
        },
        [tickets]
    )

    useEffect(
        () => {
            if (openOnly) {
                const openTicketArray = tickets.filter(ticket => {
                    return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""
                })
                setFilter(openTicketArray)
            }
            else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFilter(myTickets)
            }
        },
        [openOnly]
    )
    return <>

        {
            honeyUserObject.staff
                ? <>
                    <button onClick={() => { setEmergency(true) }}>Emergency Only </button>
                    <button onClick={() => { setEmergency(false) }}>Show All</button>
                </>
                : <>
                    <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
                    <button onClick={() => updateOpenOnly(true)}>Open Tickets</button>
                    <button onClick={() => updateOpenOnly(false)}>All MyTickets</button>
                </>
        }

        <h2>List of Tickets</h2>

        <article className="tickets">
            {
                filteredTickets.map(
                    (ticket) => <Ticket employees={employees}
                    getAllTickets={getAllTickets}
                    currentUser={honeyUserObject}
                    ticketObject={ticket} />
                )
            }
        </article>
    </>
}