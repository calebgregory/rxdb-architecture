import React, { useState, SyntheticEvent } from 'react'

import { authenticateUser } from '~/src/services/aws-cognito-auth'

export function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (evt: SyntheticEvent<HTMLFormElement | HTMLButtonElement>) => {
    evt.preventDefault()
    await authenticateUser({ username, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="username" autoComplete="username" value={username} onChange={(evt) => setUsername(evt.target.value)} />
      <input type="password" placeholder="password" autoComplete="current-password" value={password} onChange={(evt) => setPassword(evt.target.value)} />
      <button onClick={handleSubmit}>Login</button>
    </form>
  )
}
