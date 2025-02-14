import { useState, useEffect } from 'react'
import { db } from './firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  const [teams, setTeams] = useState([
    { id: 1, name: 'Lag 1', points: 0 },
    { id: 2, name: 'Lag 2', points: 0 },
    { id: 3, name: 'Lag 3', points: 0 },
    { id: 4, name: 'Lag 4', points: 0 },
    { id: 5, name: 'Lag 5', points: 0 },
    { id: 6, name: 'Lag 6', points: 0 },
  ])

  const [matches, setMatches] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Create a query that sorts by time
    const matchesRef = collection(db, 'matches')
    const q = query(matchesRef, orderBy('time'))

    console.log('Setting up Firebase listener for matches...')
    
    // Subscribe to matches collection with error handling
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        try {
          const matchList = snapshot.docs.map(doc => {
            const data = doc.data()
            
            // Get the actual team names from the data
            const teams = Object.entries(data)
              .filter(([key, value]) => key.startsWith('team') && value)
              .sort(([a], [b]) => a.localeCompare(b))
            
            const [team1 = '', team2 = ''] = teams.map(([_, value]) => value)
            
            // Log match data in a clean format
            const matchInfo = {
              score: `${data.score1}-${data.score2}`,
              status: data.isComplete ? 'Completed' : 'Not played'
            }
            console.log(`Match ${doc.id}: ${team1} vs ${team2} at ${data.time}`, matchInfo)

            return {
              id: doc.id,
              time: data.time || '',
              team1,
              team2,
              score1: data.score1 || 0,
              score2: data.score2 || 0,
              isComplete: data.isComplete || false
            }
          })
          console.log('----------------------------------------')
          console.log(`Total matches loaded: ${matchList.length}`)
          console.log('----------------------------------------')
          setMatches(matchList)
        } catch (error) {
          console.error('Error processing matches:', error)
        }
      },
      (error) => {
        console.error('Firebase subscription error:', error)
      }
    )

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up Firebase listener...')
      unsubscribe()
    }
  }, [])

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin)
  }

  if (isAdmin) {
    return <AdminPanel setIsAdmin={setIsAdmin} />
  }

  return (
    <div className="app-container">
      <header>
        <h1>Turnering Scoreboard</h1>
        <button onClick={toggleAdmin} className="admin-button">Admin</button>
      </header>
      
      <div className="main-content">
        <div className="scoreboard-section">
          <h2>Poengtabell</h2>
          <div className="teams-grid">
            {teams.map((team, index) => (
              <div key={team.id} className="team-row">
                <span className="team-position">{index + 1}</span>
                <span className="team-name-cell">{team.name}</span>
                <span className="team-points">{team.points}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="schedule-section">
          <h2>Matches ({matches.length})</h2>
          <div className="matches-list">
            {matches.map(match => (
              <div key={match.id} className="match-card">
                <div className="match-time">{match.time}</div>
                <div className="match-teams">
                  <span className="team-name">{match.team1}</span>
                  <div className="match-score">
                    <span>{match.score1}</span>
                    <span className="score-separator">-</span>
                    <span>{match.score2}</span>
                  </div>
                  <span className="team-name">{match.team2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
