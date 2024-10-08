import { useContext, useRef, useState } from "react"

import classes from "./AuthForm.module.css"
import AuthContext from "../../store/auth-context"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

const AuthForm = () => {
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const authCtx = useContext(AuthContext)

  const history = useHistory()

  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState)
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value
    setIsLoading(true)

    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCtFO7kRqgZoudLXYQqjiKvjHZjTe8l8Pg"
    if (isLogin) {
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setIsLoading(false)
          if (res.ok) {
            return res.json()
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication failed!"
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message
              }
              throw new Error(errorMessage)
            })
          }
        })
        .then((data) => {
          console.log(data)
          const token = data.idToken
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          )
          authCtx.login(token, expirationTime.toISOString())
          history.replace("/")
        })
        .catch((err) => {
          alert(err.message)
        })
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCtFO7kRqgZoudLXYQqjiKvjHZjTe8l8Pg"
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setIsLoading(false)
        if (res.ok) {
          console.log("ok")
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed!"
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message
            }
            alert(errorMessage)
          })
        }
      })
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm
