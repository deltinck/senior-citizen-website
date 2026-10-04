import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  Brain, 
  Calculator, 
  Award,
  Star,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';

const CARD_ICONS = ['🍎', '🍓', '🌻', '⭐', '❤️', '🐶', '🐱', '🍇'];

export default function BrainGamesView({ scores, refreshData, profile }) {
  const [activeGame, setActiveGame] = useState('memory'); // 'memory' or 'math'

  // --- Game 1: Memory Match States ---
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  // --- Game 2: Math Agility States ---
  const [mathProblem, setMathProblem] = useState({ q: '5 + 3', a: 8 });
  const [mathInput, setMathInput] = useState('');
  const [mathScore, setMathScore] = useState(0);
  const [mathStreak, setMathStreak] = useState(0);
  const [mathFeedback, setMathFeedback] = useState('');

  // Initialize Memory Game
  const initMemoryGame = () => {
    const deck = [...CARD_ICONS, ...CARD_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({ id: idx, icon }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setMemoryWon(false);
  };

  useEffect(() => {
    initMemoryGame();
    generateMathProblem();
  }, []);

  const handleCardClick = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        const nextMatched = [...matched, first, second];
        setMatched(nextMatched);
        setFlipped([]);

        if (nextMatched.length === cards.length) {
          setMemoryWon(true);
          const earnedScore = Math.max(100, 500 - (moves * 15));
          saveScoreToApi('Memory Card Match', earnedScore);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  // Math Game Logic
  const generateMathProblem = () => {
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const n1 = Math.floor(Math.random() * 20) + 1;
    const n2 = Math.floor(Math.random() * 15) + 1;
    if (op === '+') {
      setMathProblem({ q: `${n1} + ${n2}`, a: n1 + n2 });
    } else {
      const high = Math.max(n1, n2);
      const low = Math.min(n1, n2);
      setMathProblem({ q: `${high} - ${low}`, a: high - low });
    }
    setMathInput('');
  };

  const handleMathSubmit = (e) => {
    e.preventDefault();
    if (parseInt(mathInput) === mathProblem.a) {
      const nextScore = mathScore + 50;
      setMathScore(nextScore);
      setMathStreak(s => s + 1);
      setMathFeedback('🌟 Splendid job! That is correct!');
      generateMathProblem();

      if ((mathStreak + 1) % 5 === 0) {
        saveScoreToApi('Mental Math Agility', nextScore);
      }
    } else {
      setMathFeedback('Oops! Give it another gentle try.');
    }
  };

  const saveScoreToApi = async (gameName, score) => {
    try {
      await api.saveScore({
        game_name: gameName,
        player_name: profile?.name || 'Arthur Pendelton',
        score: score,
        level: 3
      });
      await refreshData();
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gamepad2 size={28} color="var(--accent-gold)" /> Cognitive Brain Boosters
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Gentle mental stimulation games scientifically proven to boost memory, focus, and sharp cognition.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn ${activeGame === 'memory' ? 'btn-primary' : 'btn-outline'}`}
            style={activeGame === 'memory' ? { background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' } : {}}
            onClick={() => setActiveGame('memory')}
          >
            <Brain size={18} /> Memory Cards
          </button>
          <button
            className={`btn ${activeGame === 'math' ? 'btn-primary' : 'btn-outline'}`}
            style={activeGame === 'math' ? { background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' } : {}}
            onClick={() => setActiveGame('math')}
          >
            <Calculator size={18} /> Math Agility
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Game Arena */}
        <div className="card" style={{ borderTop: '5px solid var(--accent-gold)' }}>
          {activeGame === 'memory' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Fruit & Emoji Memory Match</h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Moves: <strong>{moves}</strong> | Pairs Matched: <strong>{matched.length / 2} / {CARD_ICONS.length}</strong>
                  </span>
                </div>
                <button 
                  className="btn btn-outline btn-sm" 
                  onClick={initMemoryGame}
                  title="Restart Game"
                >
                  <RotateCcw size={16} /> Reset
                </button>
              </div>

              {memoryWon ? (
                <div style={{ textAlign: 'center', padding: '36px 20px', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '16px', color: '#92400e' }}>
                  <Sparkles size={48} style={{ margin: '0 auto 12px', color: '#d97706' }} />
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Magnificent Victory!</h3>
                  <p style={{ fontSize: '1.1rem', margin: '8px 0 16px' }}>
                    You completed the puzzle in {moves} moves! Your score was recorded to the Hall of Fame.
                  </p>
                  <button className="btn btn-primary" style={{ background: '#d97706', borderColor: '#d97706' }} onClick={initMemoryGame}>
                    Play Again
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  maxWidth: '440px',
                  margin: '0 auto'
                }}>
                  {cards.map((card, idx) => {
                    const isFlipped = flipped.includes(idx) || matched.includes(idx);
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(idx)}
                        style={{
                          height: '84px',
                          borderRadius: '12px',
                          border: isFlipped ? '2px solid var(--accent-gold)' : '2px solid var(--border-color)',
                          background: isFlipped ? 'var(--bg-card)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                          fontSize: isFlipped ? '2.4rem' : '1.4rem',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isFlipped ? 'default' : 'pointer',
                          boxShadow: 'var(--card-shadow)',
                          transition: 'all 0.2s transform'
                        }}
                      >
                        {isFlipped ? card.icon : '❓'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Math Agility */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Quick Mental Math Agility</h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Current Score: <strong>{mathScore} pts</strong> | Streak: <strong>{mathStreak}</strong>
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '2px', marginBottom: '16px' }}>
                  {mathProblem.q} = ?
                </div>

                <form onSubmit={handleMathSubmit} style={{ maxWidth: '280px', margin: '0 auto' }}>
                  <input
                    type="number"
                    autoFocus
                    className="form-input"
                    style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, padding: '10px' }}
                    placeholder="Answer"
                    value={mathInput}
                    onChange={(e) => setMathInput(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    style={{ marginTop: '14px', background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', width: '100%' }}
                  >
                    Check Answer
                  </button>
                </form>

                {mathFeedback && (
                  <p style={{ marginTop: '16px', fontSize: '1.05rem', fontWeight: 600, color: mathFeedback.includes('Splendid') ? '#15803d' : '#dc2626' }}>
                    {mathFeedback}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cognitive Hall of Fame Leaderboard */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '10px', borderRadius: '12px' }}>
              <Trophy size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Brain Fitness Hall of Fame</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Live ranking from Django Cloud Database</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {scores.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 0' }}>
                No recorded scores yet. Be the first champion!
              </p>
            ) : (
              scores.map((s, idx) => (
                <div 
                  key={s.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: idx === 0 ? '#fef3c7' : 'var(--bg-page)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: idx === 0 ? '#f59e0b' : '#94a3b8', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.98rem', display: 'block' }}>{s.player_name}</strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.game_name}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: idx === 0 ? '#b45309' : 'var(--text-main)' }}>
                      {s.score} pts
                    </span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Level {s.level}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
