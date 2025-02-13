import { useState } from 'react'
import './App.css'

function App() {
  const [teams] = useState([
    { id: 1, name: 'Lag 1', points: 0 },
    { id: 2, name: 'Lag 2', points: 0 },
    { id: 3, name: 'Lag 3', points: 0 },
    { id: 4, name: 'Lag 4', points: 0 },
    { id: 5, name: 'Lag 5', points: 0 },
    { id: 6, name: 'Lag 6', points: 0 },
  ])

  const [matches, setMatches] = useState([
    { id: 1, team1: 'Lag 1', team2: 'Lag 2', time: '14:00', score1: null, score2: null, isComplete: false },
    { id: 2, team1: 'Lag 3', team2: 'Lag 4', time: '14:35', score1: null, score2: null, isComplete: false },
    { id: 3, team1: 'Lag 5', team2: 'Lag 6', time: '15:10', score1: null, score2: null, isComplete: false },
    { id: 4, team1: 'Lag 1', team2: 'Lag 4', time: '15:45', score1: null, score2: null, isComplete: false },
    { id: 5, team1: 'Lag 3', team2: 'Lag 6', time: '16:20', score1: null, score2: null, isComplete: false },
    { id: 6, team1: 'Lag 5', team2: 'Lag 2', time: '16:55', score1: null, score2: null, isComplete: false },
    { id: 7, team1: 'Lag 1', team2: 'Lag 3', time: '17:30', score1: null, score2: null, isComplete: false },
    { id: 8, team1: 'Lag 2', team2: 'Lag 6', time: '18:05', score1: null, score2: null, isComplete: false },
    { id: 9, team1: 'Lag 5', team2: 'Lag 4', time: '18:40', score1: null, score2: null, isComplete: false },
  ])

  const updateMatchScore = (matchId, score1, score2) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        return {
          ...match,
          score1: score1,
          score2: score2,
          isComplete: true
        }
      }
      return match
    }))
  }

  return (
    <div className="app-container">
      <header>
        <h1>Turnering Scoreboard</h1>
      </header>
      
      <div className="main-content">
        <div className="scoreboard-section">
          <h2>Poengstilling</h2>
          <div className="teams-grid">
            {teams.map(team => (
              <div key={team.id} className="team-card">
                <h3>{team.name}</h3>
                <div className="points">{team.points}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="schedule-section">
          <h2>Kampplan</h2>
          <div className="matches-list">
            {matches.map(match => (
              <div key={match.id} className="match-card">
                <div className="match-time">{match.time}</div>
                <div className="match-teams">
                  <span className="team-name">{match.team1}</span>
                  {match.isComplete ? (
                    <div className="match-score">
                      <span>{match.score1}</span>
                      <span className="score-separator">-</span>
                      <span>{match.score2}</span>
                    </div>
                  ) : (
                    <span className="vs">vs</span>
                  )}
                  <span className="team-name">{match.team2}</span>
                </div>
                {!match.isComplete && (
                  <div className="score-input">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      onChange={(e) => {
                        const score2 = e.target.parentElement.querySelector('input:last-child').value
                        updateMatchScore(match.id, e.target.value, score2)
                      }}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      onChange={(e) => {
                        const score1 = e.target.parentElement.querySelector('input:first-child').value
                        updateMatchScore(match.id, score1, e.target.value)
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
