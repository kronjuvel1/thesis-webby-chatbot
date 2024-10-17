import React, { useState } from "react"

const Signup: React.FC = () => {
  const [formData, setFormData] = useState(new FormData())

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    console.log("Email:", email)
    console.log("Password:", password)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(prevFormData => {
      const newFormData = new FormData()
      prevFormData.forEach((val, key) => {
        newFormData.append(key, val)
      })
      newFormData.set(name, value)
      return newFormData
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default Signup
