import {  useState } from 'react'
import UsersTable from './DataTable/UsersTable';

import './App.css'

function App() {
  
  const [searchTerm,setSearchTerm]= useState('');
  const [term,setTerm]= useState('');

  return (
    <>
      <div className="search-bar-container">
        
        <input
          id="search"
          type="text"
          className="search-input"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key=="Enter"){
              setSearchTerm(e.target.value)
            }
          }}
          placeholder="Search by Name, Email or Role"
        />
      </div>
      <UsersTable searchTerm={searchTerm}/>
      
      
      
      
    </>
  )
}

export default App
