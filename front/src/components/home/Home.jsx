import React from 'react'
import './Home.css'
import Map from '../map/Map'

const Home = ({ filters = {} }) => {
  return (
    <div>
      <Map filters={filters} />
    </div>
  )
}

export default Home
