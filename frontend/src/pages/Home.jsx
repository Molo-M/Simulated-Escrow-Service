import React from 'react'

const Home = ({ user, error}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {user ? (
          <div>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>
        ): <div></div>}
      </div>
    </div>
  )
}

export default Home