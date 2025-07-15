import { useState, useRef, useEffect } from 'react';
import './App.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import finalImage from '../finalimage.jpg';

const QUESTIONS = [
  {
    question: 'İlişkimizin başlarında sana söyleyemediğim kelime nedir?(sen neden söylemiyorsun demiştin)',
    answer: 'AŞKIM',
    note: 'Süpersin Aşkımm💖',
  },
  {
    question: 'İlk tanıştığımız zamanlarda senin bana sık sık kullandığın kelime?',
    answer: 'ÇİÇEĞİM',
    note: 'Hatırladın mı aşkım🥰',
  },
  {
    question: 'Yine başlarda sana söylediğim ve ardından azar yediğim bir şey? :)',
    answer: 'BAL DUDAKLIM',
    note: 'Yerim o bal dudaklarını🥰',
  },
  {
    question: 'Sana aldığım ilk hediye neydi aşkımm?',
    answer: 'KAR KÜRESİ',
    note: 'Muyat alpimin kırdığını biliyorum ama olsun🥰',
  },
  {
    question: 'Muradın seni nerden yicek?',
    answer: 'TOTONDAN',
    note: 'Tam ortasından🥰',
  },
  {
    question: 'Muradına nasıl hitap ettiğinde çok seviniyor',
    answer: 'ASLANIM',
    note: 'ASLANIN YESİN SENİ..🥰 (ERKEĞİM DİYE DÜŞÜNDÜYSEN O DA OLUR AŞKIM)',
  },
  {
    question: 'Muradına öğrettiğin ilk argo kelime?',
    answer: 'DÜRRÜK',
    note: ':)',
  },
  {
    question: 'Önceden sorduğun bir soruydu aşkım. Muyat, Naşlısının kullandığı kaşıktan yemek yer mi?',
    answer: 'NAZLISINI KOMPLE YER',
    note: 'yerim vallahiii:)',
  },
];
const FINAL_MESSAGE = 'Seni çok seviyorum Nazlım!';
const PHOTO_URL = finalImage;

function getInitialRevealed(word: string) {
  return Array(word.length).fill(false);
}

function App() {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(getInitialRevealed(QUESTIONS[0].answer));
  const [input, setInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [error, setError] = useState('');
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const errorTimeout = useRef<NodeJS.Timeout | null>(null);
  const noteTimeout = useRef<NodeJS.Timeout | null>(null);
  const [started, setStarted] = useState(false);

  const WORD = QUESTIONS[current].answer;
  const QUESTION = QUESTIONS[current].question;
  const NOTE = QUESTIONS[current].note;

  const handleHint = () => {
    const unrevealedIndexes = revealed
      .map((r, i) => (!r ? i : null))
      .filter((v) => v !== null) as number[];
    if (unrevealedIndexes.length === 0) return;
    const randomIndex =
      unrevealedIndexes[Math.floor(Math.random() * unrevealedIndexes.length)];
    setAnimatingIndex(randomIndex);
    setTimeout(() => {
      const newRevealed = [...revealed];
      newRevealed[randomIndex] = true;
      setRevealed(newRevealed);
      setAnimatingIndex(null);
    }, 700);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === WORD) {
      setSuccess(true);
      setShowNote(true);
      setError('');
      // Son soruysa final ekranına geç
      if (current === QUESTIONS.length - 1) {
        noteTimeout.current = setTimeout(() => {
          setFinished(true);
        }, 5000);
      } else {
        // Kısa süreliğine notu göster, sonra sonraki soruya geç
        noteTimeout.current = setTimeout(() => {
          setCurrent((prev) => prev + 1);
          setRevealed(getInitialRevealed(QUESTIONS[current + 1].answer));
          setInput('');
          setSuccess(false);
          setShowNote(false);
        }, 5000);
      }
    } else {
      setError('Cevap yanlış, tekrar dene!');
      setInput('');
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => setError(''), 3000);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setRevealed(getInitialRevealed(QUESTIONS[0].answer));
    setInput('');
    setSuccess(false);
    setShowNote(false);
    setError('');
    setAnimatingIndex(null);
    setFinished(false);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      if (noteTimeout.current) clearTimeout(noteTimeout.current);
    };
  }, []);

  return (
    <>
      <h1>💖 NAZLI'ma Özel Kelime Oyunu 💖</h1>
      <div className="romantic-bg">
        {!started ? (
          <div className="start-area">
            <div className="start-message">8 soruluk bir quize hazır mısın hayatım?</div>
            <button className="start-btn" onClick={() => setStarted(true)}>
              Hazırım, başlayalım yakışıklım
            </button>
          </div>
        ) : finished ? (
          <div className="note-area">
            <div className="note">Tüm soruları doğru bildin! 🎉</div>
            <div className="final">
              <div className="final-message">{FINAL_MESSAGE}</div>
              <img src={PHOTO_URL} alt="Sürpriz" className="surprise-photo" />
              <div className="hearts">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="heart">❤️</span>
                ))}
              </div>
              <button className="restart-btn" onClick={handleRestart}>Tekrar Oyna</button>
            </div>
          </div>
        ) : (
          <>
            <div className="question-area">{QUESTION}</div>
            {!success && (
              <>
                {WORD.split(' ').map((kelime, kelimeIdx) => (
                  <div className="word-row" key={kelimeIdx}>
                    {kelime.split('').map((harf, i) => {
                      const globalIndex = WORD.split(' ').slice(0, kelimeIdx).join(' ').length + (kelimeIdx > 0 ? 1 : 0) + i;
                      return (
                        <span
                          className={`letter-box${animatingIndex === globalIndex ? ' animating' : ''}${revealed[globalIndex] ? ' revealed' : ''}`}
                          key={i}
                        >
                          {revealed[globalIndex] || animatingIndex === globalIndex ? harf : '_'}
                        </span>
                      );
                    })}
                  </div>
                ))}
                <button className="hint-btn" onClick={handleHint}>
                  İpucu Ver
                </button>
                <form onSubmit={handleSubmit} className="guess-form">
                  <input
                    type="text"
                    maxLength={WORD.length}
                    value={input}
                    onChange={handleInput}
                    className="guess-input"
                    placeholder="Cevabını yaz..."
                    autoFocus
                  />
                  <button type="submit" className="submit-btn">Tahmin Et</button>
                </form>
                {error && <div className="error-message">{error}</div>}
              </>
            )}
            {success && showNote && (
              <div className="note">{NOTE}</div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
