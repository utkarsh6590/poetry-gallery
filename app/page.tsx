"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Poem = {
  title: string;
  text: string;
  meaning?: string;
};

type Mood = {
  id: string;
  name: string;
  description: string;
  icon: string;
  identityColor: string;
  poems: Poem[];
};

type PoemWithMood = Poem & {
  mood: Mood;
  visualClass: string;
};

type SortMode =
  | "latest"
  | "rating"
  | "popular"
  | "liked";

const visualClasses = [
  "visual-default",
  "visual-red",
  "visual-rose",
  "visual-burgundy",
  "visual-blue",
  "visual-night",
  "visual-amber",
  "visual-brown",
  "visual-teal",
  "visual-fire",
  "visual-purple",
  "visual-olive",
];

function Logo() {
  return (
    <img
      src="/logo.jpg"
      alt="Aansu-e-Ishq"
      className="site-logo"
    />
  );
}

export default function Home() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMood, setSelectedMood] =
    useState("");

  const [selectedPoem, setSelectedPoem] =
    useState<PoemWithMood | null>(null);

  const [savedPoems, setSavedPoems] =
    useState<string[]>([]);

  const [showCollection, setShowCollection] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [latestIndex, setLatestIndex] =
    useState(0);

  const [sortMode, setSortMode] =
    useState<SortMode>("latest");

  const [isFlipped, setIsFlipped] =
    useState(false);

  const [rating, setRating] =
    useState(0);

  const [brandHindi, setBrandHindi] =
    useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  /*
   * LOAD MOODS
   */

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const indexResponse = await fetch(
          "/artworks/index.json"
        );

        if (!indexResponse.ok) {
          throw new Error(
            "index.json could not be loaded"
          );
        }

        const fileNames: string[] =
          await indexResponse.json();

        const moodFiles = await Promise.all(
          fileNames.map(async (fileName) => {
            const response = await fetch(
              `/artworks/${fileName}`
            );

            if (!response.ok) {
              throw new Error(
                `${fileName} could not be loaded`
              );
            }

            return response.json();
          })
        );

        setMoods(moodFiles);

        if (moodFiles.length > 0) {
          setSelectedMood(moodFiles[0].id);
        }
      } catch (error) {
        console.error(
          "Failed to load artworks:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  /*
   * LOAD SAVED POEMS
   */

  useEffect(() => {
    const saved =
      localStorage.getItem("saved-poems");

    if (saved) {
      try {
        setSavedPoems(JSON.parse(saved));
      } catch {
        setSavedPoems([]);
      }
    }
  }, []);

  /*
   * BRAND ROTATION
   */

  useEffect(() => {
    const interval = setInterval(() => {
      setBrandHindi((previous) => !previous);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  /*
   * ALL POEMS
   */

  const allPoems: PoemWithMood[] =
    useMemo(() => {
      return moods.flatMap((mood) =>
        mood.poems.map((poem, index) => ({
          ...poem,
          mood,
          visualClass:
            visualClasses[
              (index + mood.id.length) %
                visualClasses.length
            ],
        }))
      );
    }, [moods]);

  /*
   * LATEST POEMS
   */

  const latestPoems = allPoems.slice(0, 5);

  /*
   * RECENT POEM ROTATION
   */

  useEffect(() => {
    if (latestPoems.length === 0) return;

    const interval = setInterval(() => {
      setLatestIndex(
        (previous) =>
          (previous + 1) %
          latestPoems.length
      );
    }, 5000);

    return () =>
      clearInterval(interval);
  }, [latestPoems.length]);

  /*
   * CURRENT MOOD
   */

  const mood = moods.find(
    (item) => item.id === selectedMood
  );

  /*
   * MOOD POEMS
   */

  const moodPoems = useMemo(() => {
    if (!mood) return [];

    const poems = allPoems.filter(
      (poem) =>
        poem.mood.id === mood.id
    );

    if (
      sortMode === "rating" ||
      sortMode === "popular" ||
      sortMode === "liked"
    ) {
      return [...poems].sort(
        () => Math.random() - 0.5
      );
    }

    return poems;
  }, [mood, allPoems, sortMode]);

  /*
   * POEM KEY
   */

  const getPoemKey = (
    poem: PoemWithMood
  ) =>
    `${poem.mood.id}-${poem.title}`;

  /*
   * OPEN POEM
   */

  const openPoem = (
    poem: PoemWithMood
  ) => {
    setSelectedPoem(poem);
    setIsFlipped(false);
    setRating(0);
  };

  /*
   * SELECT MOOD
   */

  const selectMood = (
    moodId: string
  ) => {
    setSelectedMood(moodId);
    setShowCollection(false);

    setTimeout(() => {
      document
        .getElementById(
          "poetry-gallery"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  };

  /*
   * SAVE / UNSAVE
   */

  const toggleSave = (
    poem: PoemWithMood
  ) => {
    const key = getPoemKey(poem);

    const updated =
      savedPoems.includes(key)
        ? savedPoems.filter(
            (savedKey) =>
              savedKey !== key
          )
        : [...savedPoems, key];

    setSavedPoems(updated);

    localStorage.setItem(
      "saved-poems",
      JSON.stringify(updated)
    );
  };

  /*
   * SAME MOOD POEMS
   */

  const getSameMoodPoems = () => {
    if (!selectedPoem) return [];

    return allPoems.filter(
      (poem) =>
        poem.mood.id ===
        selectedPoem.mood.id
    );
  };

  /*
   * NEXT POEM
   */

  const nextPoem = () => {
    if (!selectedPoem) return;

    const poems =
      getSameMoodPoems();

    const currentIndex =
      poems.findIndex(
        (poem) =>
          getPoemKey(poem) ===
          getPoemKey(selectedPoem)
      );

    const nextIndex =
      (currentIndex + 1) %
      poems.length;

    setSelectedPoem(
      poems[nextIndex]
    );

    setIsFlipped(false);
    setRating(0);
  };

  /*
   * PREVIOUS POEM
   */

  const previousPoem = () => {
    if (!selectedPoem) return;

    const poems =
      getSameMoodPoems();

    const currentIndex =
      poems.findIndex(
        (poem) =>
          getPoemKey(poem) ===
          getPoemKey(selectedPoem)
      );

    const previousIndex =
      (currentIndex -
        1 +
        poems.length) %
      poems.length;

    setSelectedPoem(
      poems[previousIndex]
    );

    setIsFlipped(false);
    setRating(0);
  };

  /*
   * SHUFFLE
   */

  const shufflePoem = () => {
    if (allPoems.length === 0) return;

    const randomIndex =
      Math.floor(
        Math.random() *
          allPoems.length
      );

    openPoem(
      allPoems[randomIndex]
    );
  };

  /*
   * DOUBLE CLICK FLIP
   */

  const handleDoubleClick = () => {
    if (
      selectedPoem?.meaning &&
      selectedPoem.meaning.trim() !== ""
    ) {
      setIsFlipped(
        (previous) => !previous
      );
    }
  };

  /*
   * TOUCH SWIPE
   */

  const handleTouchStart = (
    event: React.TouchEvent
  ) => {
    touchStartX.current =
      event.touches[0].clientX;

    touchStartY.current =
      event.touches[0].clientY;
  };

  const handleTouchEnd = (
    event: React.TouchEvent
  ) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const endX =
      event.changedTouches[0].clientX;

    const endY =
      event.changedTouches[0].clientY;

    const deltaX =
      endX - touchStartX.current;

    const deltaY =
      endY - touchStartY.current;

    const horizontalSwipe =
      Math.abs(deltaX) > 60 &&
      Math.abs(deltaX) >
        Math.abs(deltaY);

    if (horizontalSwipe) {
      if (deltaX < 0) {
        nextPoem();
      } else {
        previousPoem();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  /*
   * MOUSE DRAG
   */

  const [dragStartX, setDragStartX] =
    useState<number | null>(null);

  const handleMouseDown = (
    event: React.MouseEvent
  ) => {
    setDragStartX(event.clientX);
  };

  const handleMouseUp = (
    event: React.MouseEvent
  ) => {
    if (dragStartX === null) return;

    const delta =
      event.clientX - dragStartX;

    if (Math.abs(delta) > 80) {
      if (delta < 0) {
        nextPoem();
      } else {
        previousPoem();
      }
    }

    setDragStartX(null);
  };

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="site-shell loading-screen">
        Loading the world of words...
      </main>
    );
  }

  return (
    <main className="site-shell">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <Logo />

          <span>
            AANSU-E-ISHQ
          </span>

        </div>

        <nav className="navigation">

          <button
            className={
              !showCollection
                ? "nav-item active"
                : "nav-item"
            }
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

              document
                .getElementById("moods")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            <span>⌕</span>
            Explore
          </button>

          <button
            className={
              showCollection
                ? "nav-item active"
                : "nav-item"
            }
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

          <div className="quote-symbol">
            “
          </div>

          <p>
            कुछ एहसास कहे
            <br />
            नहीं जाते,
            <br />
            लिखे जाते हैं।
          </p>

          <span>
            — Aansu-e-Ishq
          </span>

        </div>

        <div className="sidebar-bottom">

          <span>
            THE INK
          </span>

          <p>
            Where feelings find words.
          </p>

        </div>

      </aside>

      {/* MAIN */}

      <section className="main-content">

        <header className="topbar">

          <div className="mobile-brand">

            <Logo />

            <span>
              AANSU-E-ISHQ
            </span>

          </div>

          <div className="top-actions">

            <a
              href="https://www.instagram.com/aansu_e_ishq"
              target="_blank"
              rel="noreferrer"
              className="instagram-button"
            >
              ◎
            </a>

            <button
              className="menu-button"
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
            >
              <span />
              <span />
              <span />
            </button>

          </div>

        </header>

        {/* MENU */}

        <div
          className={`menu-panel ${
            menuOpen ? "open" : ""
          }`}
        >

          <button
            className="menu-close"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            ×
          </button>

          <div className="menu-inner">

            <span>
              EXPLORE THE WORLD OF WORDS
            </span>

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
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
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
              href="https://www.instagram.com/aansu_e_ishq"
              target="_blank"
              rel="noreferrer"
            >
              Instagram ↗
            </a>

          </div>

        </div>

        {!showCollection ? (

          <>

            {/* HERO */}

            <section className="hero-section">

              <div className="hero-content">

                <p className="eyebrow">
                  THE LANGUAGE OF FEELINGS
                </p>

                <div className="hero-brand-lockup">

                  <Logo />

                  <h1
                    className={
                      brandHindi
                        ? "brand-changing hindi"
                        : "brand-changing"
                    }
                  >
                    {brandHindi
                      ? "आंसू-ए-इश्क़"
                      : "AANSU-E-ISHQ"}
                  </h1>

                </div>

                <div className="hero-divider">

                  <span />

                  ✦

                  <span />

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
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  अपनी कविता खोजें →
                </button>

              </div>

              {latestPoems.length > 0 && (

                <div className="new-release-stage">

                  <div
                    className={`release-paper ${
                      latestPoems[
                        latestIndex
                      ].visualClass
                    }`}
                  >

                    <span>
                      RECENTLY PUBLISHED
                    </span>

                    <h3>
                      {
                        latestPoems[
                          latestIndex
                        ].title
                      }
                    </h3>

                    <p>
                      {
                        latestPoems[
                          latestIndex
                        ].text
                      }
                    </p>

                    <button
                      onClick={() =>
                        openPoem(
                          latestPoems[
                            latestIndex
                          ]
                        )
                      }
                    >
                      पढ़ें →
                    </button>

                  </div>

                  <div className="release-dots">

                    {latestPoems.map(
                      (_, index) => (

                        <button
                          key={index}
                          className={
                            latestIndex ===
                            index
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setLatestIndex(
                              index
                            )
                          }
                        />

                      )
                    )}

                  </div>

                </div>

              )}

            </section>

            {/* MOODS */}

            <section
              className="moods-section"
              id="moods"
            >

              <div className="section-heading">

                <span>
                  CHOOSE YOUR FEELING
                </span>

                <h2>
                  आज आप कैसा महसूस कर रहे हैं?
                </h2>

                <p>
                  अपनी भावना चुनें
                </p>

              </div>

              <div className="mood-grid">

                {moods.map((item) => (

                  <button
                    key={item.id}
                    className={`mood-card ${
                      selectedMood ===
                      item.id
                        ? "selected"
                        : ""
                    }`}
                    style={
                      {
                        "--mood-color":
                          item.identityColor,
                      } as React.CSSProperties
                    }
                    onClick={() =>
                      selectMood(item.id)
                    }
                  >

                    <div className="mood-color-glow" />

                    <div className="mood-icon">
                      {item.icon}
                    </div>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.description}
                    </p>

                    <div className="card-ornament">

                      <span />

                      ✦

                      <span />

                    </div>

                  </button>

                ))}

              </div>

              <button
                className="surprise-button"
                onClick={shufflePoem}
              >
                ⇄ Shuffle

                <small>
                  Let the words find you
                </small>

              </button>

            </section>

            {/* GALLERY */}

            {mood && (

              <section
                className="gallery-section"
                id="poetry-gallery"
              >

                <div className="section-heading">

                  <span>
                    YOUR EMOTIONAL WORLD
                  </span>

                  <h2>
                    {mood.name}
                  </h2>

                  <p>
                    {mood.description}
                  </p>

                </div>

                <div className="sorting-options">

                  <button
                    className={
                      sortMode === "latest"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSortMode("latest")
                    }
                  >
                    नवीनतम
                  </button>

                  <button
                    className={
                      sortMode === "rating"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSortMode("rating")
                    }
                  >
                    Most Rated
                  </button>

                  <button
                    className={
                      sortMode === "popular"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSortMode("popular")
                    }
                  >
                    Most Popular
                  </button>

                  <button
                    className={
                      sortMode === "liked"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSortMode("liked")
                    }
                  >
                    Most Liked
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

                  <div className="identity-arc" />

                  <span>
                    {mood.icon}{" "}
                    {mood.name}
                  </span>

                </div>

                <div className="poetry-gallery">

                  {moodPoems.map(
                    (poem) => (

                      <button
                        key={getPoemKey(
                          poem
                        )}
                        className={`gallery-poem ${
                          poem.visualClass
                        }`}
                        onClick={() =>
                          openPoem(poem)
                        }
                      >

                        <h3>
                          {poem.title}
                        </h3>

                        <p>
                          {
                            poem.text.split(
                              "\n"
                            )[0]
                          }
                        </p>

                        <span className="open-poem">
                          खोलें →
                        </span>

                      </button>

                    )
                  )}

                </div>

              </section>

            )}

          </>

        ) : (

          /* COLLECTION */

          <section className="collection-section">

            <span>
              YOUR PERSONAL SPACE
            </span>

            <h1>
              मेरी रचनाएं
            </h1>

            <p>
              जो शब्द तुम्हें पसंद आए,
              <br />
              उन्हें अपने पास रखो।
            </p>

            {savedPoems.length === 0 ? (

              <div className="empty-collection">

                <div>
                  ♡
                </div>

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

                {allPoems
                  .filter((poem) =>
                    savedPoems.includes(
                      getPoemKey(poem)
                    )
                  )
                  .map((poem) => (

                    <article
                      key={getPoemKey(
                        poem
                      )}
                      className={`saved-poem-card ${
                        poem.visualClass
                      }`}
                    >

                      <span>
                        {poem.title}
                      </span>

                      <p>
                        {poem.text}
                      </p>

                      <button
                        onClick={() =>
                          toggleSave(poem)
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

          <span>
            READ · FEEL · CONNECT
          </span>

          <a
            href="https://www.instagram.com/aansu_e_ishq"
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>

          <span>
            © AANSU-E-ISHQ
          </span>

        </footer>

      </section>

      {/* POEM OVERLAY */}

      {selectedPoem && (

        <div className="poem-overlay">

          <button
            className="overlay-close"
            onClick={() => {
              setSelectedPoem(null);
              setIsFlipped(false);
            }}
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
            className={`flashcard-wrapper ${
              selectedPoem.visualClass
            } ${
              isFlipped
                ? "is-flipped"
                : ""
            }`}
            onDoubleClick={
              handleDoubleClick
            }
            onTouchStart={
              handleTouchStart
            }
            onTouchEnd={
              handleTouchEnd
            }
            onMouseDown={
              handleMouseDown
            }
            onMouseUp={
              handleMouseUp
            }
          >

            {/* FRONT */}

            <div className="flashcard-face flashcard-front">

              <div
                className="flashcard-mood-arc"
                style={
                  {
                    "--identity-color":
                      selectedPoem
                        .mood
                        .identityColor,
                  } as React.CSSProperties
                }
              />

              <div className="flashcard-top">

                <span>
                  {
                    selectedPoem
                      .mood
                      .icon
                  }{" "}
                  {
                    selectedPoem
                      .mood
                      .name
                  }
                </span>

                <button
                  className={`flash-save ${
                    savedPoems.includes(
                      getPoemKey(
                        selectedPoem
                      )
                    )
                      ? "saved"
                      : ""
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();

                    toggleSave(
                      selectedPoem
                    );
                  }}
                >
                  {savedPoems.includes(
                    getPoemKey(
                      selectedPoem
                    )
                  )
                    ? "♥"
                    : "♡"}
                </button>

              </div>

              <div className="flashcard-content">

                <span className="flashcard-label">
                  {
                    selectedPoem.title
                  }
                </span>

                <div className="flashcard-text">

                  {selectedPoem.text
                    .split("\n")
                    .map(
                      (line, index) => (

                        <p key={index}>
                          {line ||
                            "\u00A0"}
                        </p>

                      )
                    )}

                </div>

              </div>

              <div className="rating-section">

                <span>
                  Rate this poem
                </span>

                <div className="rating-stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <button
                        key={star}
                        onClick={(event) => {
                          event.stopPropagation();
                          setRating(star);
                        }}
                        className={
                          star <= rating
                            ? "rated"
                            : ""
                        }
                      >
                        ★
                      </button>

                    )
                  )}

                </div>

              </div>

              <div className="flashcard-bottom">

                <span>
                  — Aansu-e-Ishq
                </span>

                <small>
                  Swipe to explore · Double-click to flip
                </small>

              </div>

            </div>

            {/* BACK */}

            <div className="flashcard-face flashcard-back">

              <span className="meaning-label">
                भावार्थ
              </span>

              <h2>
                {
                  selectedPoem.title
                }
              </h2>

              <p>
                {
                  selectedPoem.meaning ||
                  "इस कविता का भावार्थ अभी उपलब्ध नहीं है।"
                }
              </p>

              <small>
                Double-click to return
              </small>

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

            <span>
              SWIPE
            </span>

            अगली कविता →

          </div>

        </div>

      )}

    </main>
  );
}