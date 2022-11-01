import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Tickets.css"

export const TicketList = ({ searchTermState }) => {
    const [tickets, setTickets] = useState([])
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
    useEffect(
        () => {
            // console.log("Initial state of tickets", tickets) // View the initial state of tickets
            fetch(`http://localhost:8088/serviceTickets`)
                .then(res => res.json())
                .then((ticketArray) => {
                    setTickets(ticketArray)
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
            <button onClick={ () => {setEmergency(true) } }>Emergency Only </button> 
            <button onClick={ () => {setEmergency(false) } }>Show All</button>
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
                    (ticket) => {
                        return <section className="ticket" key={`ticket--${ticket.id}`}>
                            <header>{ticket.description}</header>
                            <footer>Emergency: {ticket.emergency ? `༼ つ ◕_◕ ༽つ` : "No"}</footer>
                        </section>
                    }
                )
            }
        </article>
    </>
}