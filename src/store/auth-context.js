import React, { useCallback, useEffect, useState } from "react"

let logoutTimer

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
})

const calculateRemainungTime = (expirationTime) => {
  const currentTime = new Date().getTime()
  const adjExpirationTime = new Date(expirationTime).getTime()

  const remainingDuration = adjExpirationTime - currentTime

  return remainingDuration
}

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token")
  const storedExpDate = localStorage.getItem("exp")

  const remainingTime = calculateRemainungTime(storedExpDate)

  if (remainingTime <= 60000) {
    localStorage.removeItem("token")
    localStorage.removeItem("exp")
    return
  }

  return {
    token: storedToken,
    duration: remainingTime,
  }
}

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken()
  let initialToken
  if (tokenData) {
    initialToken = tokenData.token
  }

  const [token, setToken] = useState(initialToken)

  const userIsLoggedIn = !!token

  const logoutHandler = useCallback(() => {
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("exp")

    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }, [])

  const loginHandler = (token, expirationTime) => {
    setToken(token)
    localStorage.setItem("token", token)
    localStorage.setItem("exp", expirationTime)

    const remainingTime = calculateRemainungTime(expirationTime)

    logoutTimer = setTimeout(logoutHandler, remainingTime)
  }

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration)
    }
  }, [tokenData, logoutHandler])

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext
