"use client";

import { useEffect, useMemo, useState } from "react";

type Mood = {
  id: string;
  name: string;
  description: string;
  icon: string;
  identityColor: string;
};

type Poem = {
  id: number;
  mood: string;
  title: string;
  text: string;
  author: string;
  date: string;
  visualClass: string;
  rating: number;
  likes: number;
  views: number;
};

type SortMode = "latest" | "rating" | "popular" | "liked";

function SampleLogo() {
  return (
    <svg
      className="sample-logo"
      viewBox="0 0 100 100"
      aria-label="Aansu-e-Ishq logo"
    >
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="26"
        fill="#11100D"
        stroke="#C5A46D"
        strokeWidth="1"
      />

      <path
        d="M27 70C45 60 61 42 75 22"
        stroke="#C5A46D"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M35 63C46 59 56 53 64 44"
        stroke="#E3C996"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M29 72C42 77 55 75 66 68"
        stroke="#8D3035"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <circle cx="75" cy="22" r="3" fill="#E3C996" />
    </svg>
  );
}

const moods: Mood[] = [
  {
    id: "ishq",
    name: "इश्क़",
    description: "मोहब्बत की बातें",
    icon: "♡",
    identityColor: "#8d3035",
  },
  {
    id: "tanhai",
    name: "तन्हाई",
    description: "जब अकेलापन बोले",
    icon: "☁",
    identityColor: "#405d78",
  },
  {
    id: "dard",
    name: "दर्द",
    description: "कुछ अधूरे एहसास",
    icon: "✦",
    identityColor: "#9b7046",
  },
  {
    id: "yaadein",
    name: "यादें",
    description: "जो पीछे छूट गया",
    icon: "❧",
    identityColor: "#43716c",
  },
  {
    id: "gussa",
    name: "गुस्सा",
    description: "अंदर की आग",
    icon: "♨",
    identityColor: "#8d3b27",
  },
  {
    id: "junoon",
    name: "जुनून",
    description: "जो रुकने न दे",
    icon: "✧",
    identityColor: "#704a82",
  },
  {
    id: "swabhiman",
    name: "स्वाभिमान",
    description: "खुद से समझौता नहीं",
    icon: "♕",
    identityColor: "#777044",
  },
];

const poems: Poem[] = [
  {
    id: 1,
    mood: "ishq",
    title: "तुम",
    text: "तुमसे मोहब्बत कुछ ऐसी हुई,\nकि खुद से मिलना भी कम हो गया।\n\nतुम्हें सोचते सोचते,\nमेरा हर ख्वाब तुम हो गया।",
    author: "Aansu-e-Ishq",
    date: "2026-07-25",
    visualClass: "visual-red",
    rating: 4.8,
    likes: 128,
    views: 640,
  },
  {
    id: 2,
    mood: "ishq",
    title: "मोहब्बत",
    text: "तुम्हारा होना ही काफी था,\nमेरी दुनिया को खूबसूरत बनाने के लिए।\n\nवरना हम तो वो थे,\nजो खुद से भी मिला नहीं करते थे।",
    author: "Aansu-e-Ishq",
    date: "2026-07-24",
    visualClass: "visual-rose",
    rating: 4.6,
    likes: 94,
    views: 510,
  },
  {
    id: 3,
    mood: "ishq",
    title: "इश्क़ का शहर",
    text: "तेरे शहर में आकर,\nहम खुद को भूल गए।\n\nतू मिला तो लगा,\nहम पहले कभी पूरे थे ही नहीं।",
    author: "Aansu-e-Ishq",
    date: "2026-07-20",
    visualClass: "visual-burgundy",
    rating: 4.9,
    likes: 176,
    views: 820,
  },
  {
    id: 4,
    mood: "tanhai",
    title: "तन्हाई",
    text: "भीड़ में भी अकेला था मैं,\nशायद खुद से दूर था मैं।\n\nसबको अपना समझता रहा,\nऔर अंत में खुद का ही न रहा।",
    author: "Aansu-e-Ishq",
    date: "2026-07-23",
    visualClass: "visual-blue",
    rating: 4.7,
    likes: 111,
    views: 700,
  },
  {
    id: 5,
    mood: "tanhai",
    title: "खामोशी",
    text: "कुछ बातें कही नहीं जातीं,\nबस आंखों में ठहर जाती हैं।\n\nऔर कुछ लोग,\nजिंदगी से जाकर भी नहीं जाते।",
    author: "Aansu-e-Ishq",
    date: "2026-07-21",
    visualClass: "visual-night",
    rating: 4.9,
    likes: 205,
    views: 1050,
  },
  {
    id: 6,
    mood: "dard",
    title: "दर्द",
    text: "दर्द तो बहुत था दिल में,\nमगर शिकायत किससे करते।\n\nजिसे अपना समझा था,\nउसी से तो दूर थे।",
    author: "Aansu-e-Ishq",
    date: "2026-07-22",
    visualClass: "visual-amber",
    rating: 4.5,
    likes: 83,
    views: 450,
  },
  {
    id: 7,
    mood: "dard",
    title: "अधूरापन",
    text: "कुछ कहानियां पूरी होकर भी,\nपूरी नहीं होतीं।\n\nकुछ लोग मिलकर भी,\nहमारे नहीं होते।",
    author: "Aansu-e-Ishq",
    date: "2026-07-19",
    visualClass: "visual-brown",
    rating: 4.8,
    likes: 142,
    views: 690,
  },
  {
    id: 8,
    mood: "yaadein",
    title: "यादें",
    text: "कुछ लोग जाते नहीं,\nबस दिखना बंद हो जाते हैं।\n\nउनकी यादें मगर,\nहर रोज़ मिलने आती हैं।",
    author: "Aansu-e-Ishq",
    date: "2026-07-18",
    visualClass: "visual-teal",
    rating: 4.7,
    likes: 132,
    views: 620,
  },
  {
    id: 9,
    mood: "gussa",
    title: "अब उम्मीद नहीं",
    text: "अब किसी से नाराज़ नहीं हूं,\nबस उम्मीद करना छोड़ दिया है।\n\nजो समझना था,\nवो वक्त ने समझा दिया।",
    author: "Aansu-e-Ishq",
    date: "2026-07-17",
    visualClass: "visual-fire",
    rating: 4.9,
    likes: 218,
    views: 1200,
  },
  {
    id: 10,
    mood: "junoon",
    title: "रुकना नहीं",
    text: "रास्ते मुश्किल हैं तो क्या,\nचलना हमने सीखा है।\n\nगिरकर उठना आता है हमें,\nहारना नहीं।",
    author: "Aansu-e-Ishq",
    date: "2026-07-16",
    visualClass: "visual-purple",
    rating: 4.8,
    likes: 155,
    views: 880,
  },
  {
    id: 11,
    mood: "swabhiman",
    title: "झुकना नहीं",
    text: "जहां मेरी कदर न हो,\nवहां रुकना मेरी आदत नहीं।\n\nमैं अकेला चल सकता हूं,\nमगर झुककर नहीं।",
    author: "Aansu-e-Ishq",
    date: "2026-07-15",
    visualClass: "visual-olive",
    rating: 4.6,
    likes: 91,
    views: 530,
  },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState("ishq");
  const [selectedPoemId, setSelectedPoemId] = useState<number | null>(null);
  const [savedPoems, setSavedPoems] = useState<number[]>([]);
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [showCollection, setShowCollection] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [latestIndex, setLatestIndex] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>("latest");

  const mood = moods.find((item) => item.id === selectedMood)!;

  useEffect(() => {
    const saved = localStorage.getItem("saved-poems");
    const ratings = localStorage.getItem("poem-ratings");

    if (saved) setSavedPoems(JSON.parse(saved));
    if (ratings) setUserRatings(JSON.parse(ratings));
  }, []);

  const latestPoems = poems.slice(0, 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatestIndex((prev) => (prev + 1) % latestPoems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [latestPoems.length]);

  const moodPoems = useMemo(() => {
    const filtered = poems.filter(
      (poem) => poem.mood === selectedMood
    );

    if (sortMode === "rating") {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }

    if (sortMode === "popular") {
      return [...filtered].sort((a, b) => b.views - a.views);
    }

    if (sortMode === "liked") {
      return [...filtered].sort((a, b) => b.likes - a.likes);
    }

    return [...filtered].sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );
  }, [selectedMood, sortMode]);

  const selectedPoem = poems.find(
    (poem) => poem.id === selectedPoemId
  );

  const selectMood = (moodId: string) => {
    setSelectedMood(moodId);
    setSelectedPoemId(null);
    setShowCollection(false);

    setTimeout(() => {
      document
        .getElementById("poetry-gallery")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const openPoem = (poem: Poem) => {
    setSelectedMood(poem.mood);
    setSelectedPoemId(poem.id);
  };

  const toggleSave = (id: number) => {
    const updated = savedPoems.includes(id)
      ? savedPoems.filter((poemId) => poemId !== id)
      : [...savedPoems, id];

    setSavedPoems(updated);
    localStorage.setItem("saved-poems", JSON.stringify(updated));
  };

  const ratePoem = (id: number, rating: number) => {
    const updated = {
      ...userRatings,
      [id]: rating,
    };

    setUserRatings(updated);
    localStorage.setItem("poem-ratings", JSON.stringify(updated));
  };

  const nextPoem = () => {
    const currentIndex = moodPoems.findIndex(
      (poem) => poem.id === selectedPoemId
    );

    const nextIndex =
      (currentIndex + 1) % moodPoems.length;

    setSelectedPoemId(moodPoems[nextIndex].id);
  };

  const previousPoem = () => {
    const currentIndex = moodPoems.findIndex(
      (poem) => poem.id === selectedPoemId
    );

    const previousIndex =
      (currentIndex - 1 + moodPoems.length) %
      moodPoems.length;

    setSelectedPoemId(moodPoems[previousIndex].id);
  };

  const surpriseMe = () => {
    const randomMood =
      moods[Math.floor(Math.random() * moods.length)];

    setSelectedMood(randomMood.id);
    setSelectedPoemId(null);

    setTimeout(() => {
      document
        .getElementById("poetry-gallery")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="site-shell">
      <aside className="sidebar">
        <div className="brand">
          <SampleLogo />
          <span>AANSU-E-ISHQ</span>
        </div>

        <nav className="navigation">
          <button
            className={!showCollection ? "nav-item active" : "nav-item"}
            onClick={() => {
              setShowCollection(false);
              setMenuOpen(false);
            }}
          >
            <span>⌂</span>
            Home
          </button>

          <button
            className="nav-item"
            onClick={() => {
              setShowCollection(false);
              setMenuOpen(false);

              document
                .getElementById("moods")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>⌕</span>
            Explore
          </button>

          <button
            className={showCollection ? "nav-item active" : "nav-item"}
            onClick={() => {
              setShowCollection(true);
              setMenuOpen(false);
            }}
          >
            <span>♡</span>
            मेरी रचनाएं
          </button>
        </nav>

        <div className="sidebar-quote">
          <div className="quote-symbol">“</div>

          <p>
            कुछ एहसास कहे
            <br />
            नहीं जाते,
            <br />
            लिखे जाते हैं।
          </p>

          <span>— Aansu-e-Ishq</span>
        </div>

        <div className="sidebar-bottom">
          <span>THE INK</span>
          <p>Where feelings find words.</p>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            AANSU-E-ISHQ
          </div>

          <div className="top-actions">
            <a
              href="https://www.instagram.com/aansu_e_ishq?igsh=MWsyd2JkbWRyOXJiOQ=="
              target="_blank"
              rel="noreferrer"
              className="instagram-button"
              aria-label="Instagram"
            >
              ◎
            </a>

            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>

        <div className={`menu-panel ${menuOpen ? "open" : ""}`}>
          <button
            className="menu-close"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>

          <div className="menu-inner">
            <span>EXPLORE THE WORLD OF WORDS</span>

            <button
              onClick={() => {
                setShowCollection(false);
                setMenuOpen(false);
              }}
            >
              Home
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);

                document
                  .getElementById("moods")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Moods
            </button>

            <button
              onClick={() => {
                setShowCollection(true);
                setMenuOpen(false);
              }}
            >
              मेरी रचनाएं
            </button>

            <a
              href="https://www.instagram.com/aansu_e_ishq?igsh=MWsyd2JkbWRyOXJiOQ=="
              target="_blank"
              rel="noreferrer"
            >
              Instagram ↗
            </a>

            <a href="mailto:contact@aansueishq.com">
              Contact ↗
            </a>
          </div>
        </div>

        {!showCollection ? (
          <>
            <section className="hero-section">
              <div className="hero-content">
                <p className="eyebrow">
                  THE LANGUAGE OF FEELINGS
                </p>

                <h1>AANSU-E-ISHQ</h1>

                <div className="hero-divider">
                  <span></span>
                  ✦
                  <span></span>
                </div>

                <h2>
                  कुछ एहसास कहे नहीं जाते,
                  <br />
                  लिखे जाते हैं।
                </h2>

                <button
                  className="primary-button"
                  onClick={() =>
                    document
                      .getElementById("moods")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  अपनी कविता खोजें →
                </button>
              </div>

              <div className="new-release-stage">
                <div
                  className={`release-paper ${latestPoems[latestIndex].visualClass}`}
                >
                  <span>
                    NEW RELEASE · {latestIndex + 1}/5
                  </span>

                  <h3>
                    {latestPoems[latestIndex].title}
                  </h3>

                  <p>
                    {latestPoems[latestIndex].text}
                  </p>

                  <button
                    onClick={() =>
                      openPoem(latestPoems[latestIndex])
                    }
                  >
                    पढ़ें →
                  </button>
                </div>

                <div className="release-dots">
                  {latestPoems.map((_, index) => (
                    <button
                      key={index}
                      className={
                        latestIndex === index ? "active" : ""
                      }
                      onClick={() => setLatestIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="moods-section" id="moods">
              <div className="section-heading">
                <span>CHOOSE YOUR FEELING</span>

                <h2>
                  आज आप कैसा महसूस कर रहे हैं?
                </h2>

                <p>अपनी भावना चुनें</p>
              </div>

              <div className="mood-grid">
                {moods.map((item) => (
                  <button
                    key={item.id}
                    className={`mood-card mood-${item.id} ${
                      selectedMood === item.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => selectMood(item.id)}
                  >
                    <div className="mood-icon">
                      {item.icon}
                    </div>

                    <h3>{item.name}</h3>

                    <p>{item.description}</p>

                    <div className="card-ornament">
                      <span></span>
                      ✦
                      <span></span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                className="surprise-button"
                onClick={surpriseMe}
              >
                ✨ मुझे चौंकाओ
                <small>
                  किसी भी एहसास तक पहुंचो
                </small>
              </button>
            </section>

            <section
              className="gallery-section"
              id="poetry-gallery"
            >
              <div className="section-heading">
                <span>YOUR EMOTIONAL WORLD</span>

                <h2>{mood.name}</h2>

                <p>{mood.description}</p>
              </div>

              <div className="sorting-options">
                <button
                  className={
                    sortMode === "latest"
                      ? "active"
                      : ""
                  }
                  onClick={() => setSortMode("latest")}
                >
                  नवीनतम
                </button>

                <button
                  className={
                    sortMode === "rating"
                      ? "active"
                      : ""
                  }
                  onClick={() => setSortMode("rating")}
                >
                  ⭐ Best Rated
                </button>

                <button
                  className={
                    sortMode === "popular"
                      ? "active"
                      : ""
                  }
                  onClick={() => setSortMode("popular")}
                >
                  ◉ Most Popular
                </button>

                <button
                  className={
                    sortMode === "liked"
                      ? "active"
                      : ""
                  }
                  onClick={() => setSortMode("liked")}
                >
                  ♥ Most Liked
                </button>
              </div>

              <div
                className="mood-identity"
                style={
                  {
                    "--identity-color":
                      mood.identityColor,
                  } as React.CSSProperties
                }
              >
                <div className="identity-arc"></div>

                <span>
                  {mood.icon} {mood.name}
                </span>
              </div>

              <div className="poetry-gallery">
                {moodPoems.map((poem, index) => (
                  <button
                    key={poem.id}
                    className={`gallery-poem ${poem.visualClass}`}
                    onClick={() => openPoem(poem)}
                  >
                    <span className="gallery-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{poem.title}</h3>

                    <p>
                      {poem.text.split("\n")[0]}
                    </p>

                    <div className="poem-stats">
                      <span>
                        ★ {poem.rating.toFixed(1)}
                      </span>

                      <span>
                        ♥ {poem.likes}
                      </span>

                      <span>
                        ◉ {poem.views}
                      </span>
                    </div>

                    <span className="open-poem">
                      खोलें →
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="collection-section">
            <span>YOUR PERSONAL SPACE</span>

            <h1>मेरी रचनाएं</h1>

            <p>
              जो शब्द तुम्हें पसंद आए,
              <br />
              उन्हें अपने पास रखो।
            </p>

            {savedPoems.length === 0 ? (
              <div className="empty-collection">
                <div>♡</div>

                <h2>
                  अभी यहां कुछ नहीं है
                </h2>

                <p>
                  किसी कविता को पसंद करो,
                  <br />
                  वह यहां हमेशा के लिए मिल जाएगी।
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowCollection(false)
                  }
                >
                  कविताएं खोजें →
                </button>
              </div>
            ) : (
              <div className="saved-grid">
                {poems
                  .filter((poem) =>
                    savedPoems.includes(poem.id)
                  )
                  .map((poem) => (
                    <article
                      key={poem.id}
                      className={`saved-poem-card ${poem.visualClass}`}
                    >
                      <span>{poem.title}</span>

                      <p>{poem.text}</p>

                      <button
                        onClick={() =>
                          toggleSave(poem.id)
                        }
                        className="remove-save"
                      >
                        ♥ Saved
                      </button>
                    </article>
                  ))}
              </div>
            )}
          </section>
        )}

        <footer className="footer">
          <span>READ · FEEL · CONNECT</span>

          <a
            href="https://www.instagram.com/aansu_e_ishq?igsh=MWsyd2JkbWRyOXJiOQ=="
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>

          <span>© AANSU-E-ISHQ</span>
        </footer>
      </section>

      {selectedPoem && (
        <div className="poem-overlay">
          <button
            className="overlay-close"
            onClick={() =>
              setSelectedPoemId(null)
            }
          >
            ×
          </button>

          <button
            className="overlay-arrow left"
            onClick={previousPoem}
          >
            ←
          </button>

          <div
            className={`flashcard-wrapper ${selectedPoem.visualClass}`}
            onTouchStart={(event) => {
              const touch = event.touches[0];

              (
                event.currentTarget as HTMLElement
              ).dataset.startX =
                touch.clientX.toString();
            }}
            onTouchEnd={(event) => {
              const startX = Number(
                (
                  event.currentTarget as HTMLElement
                ).dataset.startX
              );

              const endX =
                event.changedTouches[0].clientX;

              const difference = endX - startX;

              if (difference > 60) previousPoem();

              if (difference < -60) nextPoem();
            }}
          >
            <div
              className="flashcard-mood-arc"
              style={
                {
                  "--identity-color":
                    mood.identityColor,
                } as React.CSSProperties
              }
            ></div>

            <div className="flashcard-top">
              <span>
                {mood.icon} {mood.name}
              </span>

              <button
                className={`flash-save ${
                  savedPoems.includes(
                    selectedPoem.id
                  )
                    ? "saved"
                    : ""
                }`}
                onClick={() =>
                  toggleSave(selectedPoem.id)
                }
              >
                {savedPoems.includes(
                  selectedPoem.id
                )
                  ? "♥"
                  : "♡"}
              </button>
            </div>

            <div className="flashcard-content">
              <span className="flashcard-label">
                {selectedPoem.title}
              </span>

              <div className="flashcard-text">
                {selectedPoem.text
                  .split("\n")
                  .map((line, index) => (
                    <p key={index}>
                      {line || "\u00A0"}
                    </p>
                  ))}
              </div>
            </div>

            <div className="rating-section">
              <span>
                इस कविता को महसूस करें
              </span>

              <div className="stars">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      className={
                        (
                          userRatings[
                            selectedPoem.id
                          ] || 0
                        ) >= star
                          ? "selected-star"
                          : ""
                      }
                      onClick={() =>
                        ratePoem(
                          selectedPoem.id,
                          star
                        )
                      }
                    >
                      ★
                    </button>
                  )
                )}
              </div>

              <small>
                {userRatings[selectedPoem.id]
                  ? `आपकी rating: ${userRatings[selectedPoem.id]}/5`
                  : "अपनी rating दें"}
                {" · "}
                Average:{" "}
                {selectedPoem.rating.toFixed(1)}/5
              </small>
            </div>

            <div className="flashcard-bottom">
              <span>
                — {selectedPoem.author}
              </span>

              <span>
                {moodPoems.findIndex(
                  (poem) =>
                    poem.id === selectedPoem.id
                ) + 1}{" "}
                / {moodPoems.length}
              </span>
            </div>
          </div>

          <button
            className="overlay-arrow right"
            onClick={nextPoem}
          >
            →
          </button>

          <div className="swipe-text">
            ← पिछली कविता
            <span>SWIPE</span>
            अगली कविता →
          </div>
        </div>
      )}
    </main>
  );
}