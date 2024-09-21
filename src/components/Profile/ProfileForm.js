import { useContext, useRef } from "react"
import classes from "./ProfileForm.module.css"
import AuthContext from "../../store/auth-context"

const ProfileForm = () => {
  const newPasswordInputRef = useRef()
  const authCtx = useContext(AuthContext)

  const submitHandler = (e) => {
    e.preventDefault()

    const newPassword = newPasswordInputRef.current.value

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCtFO7kRqgZoudLXYQqjiKvjHZjTe8l8Pg",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: newPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {})
  }
  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
