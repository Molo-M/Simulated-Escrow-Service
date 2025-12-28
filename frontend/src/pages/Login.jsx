import React, { useState } from 'react';
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")

  // Function to get form data
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  // Function for sumitting form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/auth/login")
    } catch (error) {
      
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form action="mb-4">
          <div className="">
            <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400" 
              placeholder="Enter your email" 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              autoComplete="off" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400" 
              placeholder="Enter your password" 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange} required />
          </div>
          <button className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 font-medium cursor-pointer">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login