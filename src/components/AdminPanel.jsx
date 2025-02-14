import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, doc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import './AdminPanel.css';

function AdminPanel({ setIsAdmin }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (user) {
        setupMatchesListener();
        setupTeamsListener();
      }
    });

    return () => unsubscribe();
  }, []);

  const setupMatchesListener = () => {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(matchesRef, orderBy('time'));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          try {
            const matchList = snapshot.docs.map(doc => {
              const data = doc.data();
              
              // Extract team names from data
              const team1 = data.team1 || '';
              const team2 = data.team2 || '';
              const team3 = data.team3 || '';
              const team4 = data.team4 || '';
              const team5 = data.team5 || '';
              const team6 = data.team6 || '';
              
              // Find the actual teams playing in this match
              const teams = [team1, team2, team3, team4, team5, team6].filter(team => team !== '');
              const [homeTeam = '', awayTeam = ''] = teams;

              return {
                id: doc.id,
                time: data.time || '',
                team1: homeTeam,
                team2: awayTeam,
                score1: data.score1 || 0,
                score2: data.score2 || 0,
                isComplete: data.isComplete || false
              };
            });
            setMatches(matchList);
            setError('');
          } catch (err) {
            setError('Error processing matches');
            console.error('Error processing matches in admin panel:', err);
          }
        },
        (error) => {
          setError('Error fetching matches');
          console.error('Firebase subscription error in admin panel:', error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError('Error setting up matches listener');
      console.error('Error setting up matches listener:', err);
    }
  };

  const setupTeamsListener = () => {
    try {
      const teamsRef = collection(db, 'teams');
      const q = query(teamsRef, orderBy('name'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const teamsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeams(teamsList);
      });

      return unsubscribe;
    } catch (err) {
      setError('Error setting up teams listener');
      console.error('Error setting up teams listener:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError('Error logging out');
      console.error(err);
    }
  };

  const updateScore = async (matchId, score1, score2) => {
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, {
        score1: parseInt(score1) || 0,
        score2: parseInt(score2) || 0,
        isComplete: true
      });
    } catch (err) {
      setError('Error updating score');
      console.error(err);
    }
  };

  const updateTeamPoints = async (teamId, points) => {
    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        points: parseInt(points) || 0
      });
      setError('');
    } catch (err) {
      setError('Error updating team points');
      console.error('Error updating team points:', err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <div className="admin-login">
          <h2>Admin Login</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <button className="back-button" onClick={() => setIsAdmin(false)}>Back to Main Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Tournament Admin</h2>
          <div className="admin-buttons">
            <button onClick={() => setIsAdmin(false)}>Back to Main Page</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        
        <div className="admin-sections">
          <div className="points-section">
            <h3>Team Points</h3>
            <div className="teams-grid">
              {teams.map(team => (
                <div key={team.id} className="team-points-row">
                  <span className="team-name">{team.name}</span>
                  <input
                    type="number"
                    min="0"
                    value={team.points || 0}
                    onChange={(e) => updateTeamPoints(team.id, e.target.value)}
                    className="points-input"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="matches-section">
            <h3>Matches</h3>
            <div className="matches-admin-list">
              {matches.map(match => (
                <div key={match.id} className="match-admin-card">
                  <div className="match-time">{match.time}</div>
                  <div className="match-teams">
                    <span className="team-name">{match.team1}</span>
                    <div className="score-inputs">
                      <input
                        type="number"
                        min="0"
                        value={match.score1 || ''}
                        onChange={(e) => updateScore(match.id, e.target.value, match.score2 || 0)}
                      />
                      <span className="score-separator">-</span>
                      <input
                        type="number"
                        min="0"
                        value={match.score2 || ''}
                        onChange={(e) => updateScore(match.id, match.score1 || 0, e.target.value)}
                      />
                    </div>
                    <span className="team-name">{match.team2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
