import { useState } from "react"
import { TicketList } from "./TicketList"
import { TicketSearch } from "./TicketSEarch"

export const TicketContainer = () => {
    const [searchTerms, setSearchTerms] = useState("")

    return <>
        <TicketSearch setterFunction={setSearchTerms} />
        <TicketList searchTermState={searchTerms} />
    </>
}