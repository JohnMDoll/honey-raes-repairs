import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const TicketEdit = () => {
    const { ticketId } = useParams()
    const navigate = useNavigate()
    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)
    const [getTicket, setTicket] = useState(
        {id: 0, userId: 0, description: "", emergency: false}
    )

    useEffect(
        () => {
            fetch(`http://localhost:8088/serviceTickets?&id=${ticketId}`)
                .then(res => res.json())
                .then((ticketArray) => {
                    const thisTicket = ticketArray[0]
                    setTicket(thisTicket)
                })
        },
        []
    )

    const handleSaveButtonClick = (event) => {
        event.preventDefault()

            const ticketToSendToAPI = {
                id: getTicket.id,
                userId: getTicket.userId,
                description: getTicket.description,
                emergency: getTicket.emergency,
                dateCompleted: ""
        }

        return fetch(`http://localhost:8088/serviceTickets/${ticketId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticketToSendToAPI)
        })
        .then(res =>res.json())
        .then(() => {
            navigate("/tickets")
        })

    }

    return (
        <form className="ticketForm">
            <h2 className="ticketForm__title">New Service Ticket</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        style={{ height: "6rem" }}
                        required autoFocus
                        type="text"
                        className="form-control"
                        value={getTicket.description}
                        onChange={
                            (evt) => {
                                const copy = {...getTicket}
                                copy.description = evt.target.value
                                setTicket(copy)
                            }
                        } ></textarea>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Emergency:</label>
                    <input type="checkbox"
                        checked= {getTicket.emergency}
                        onChange={
                            (evt) => {
                                const copy = {...getTicket}
                                copy.emergency = evt.target.checked
                                setTicket(copy)
                            }
                        } />
                </div>
            </fieldset>
            <button 
                onClick={(clickEvent) => handleSaveButtonClick(clickEvent)}
                className="btn btn-primary">
                Submit Ticket
            </button>
        </form>
    )
}