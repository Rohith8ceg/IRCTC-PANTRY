import React from "react"

const UserContext = React.createContext([{name: null, phone: null, error: false},()=>{}])

export default UserContext