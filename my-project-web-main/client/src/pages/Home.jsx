import { Link } from 'react-router-dom';
import '../index.css';

export default function Home() {
  return (
    <>
    <div className="home-container">
      <video className="background-video" autoPlay loop muted>
        <source src="/disney-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay-content">
        <h1>Disney 100</h1>
        <p>
          The Disney 100 Years of Wonder celebration, also known as Disney 100 or Disney100 with #Disney100,
          was the 100th anniversary celebration of The Walt Disney Company.
        </p>
        <Link to="/about" className="about-button">About us</Link>
      </div>
    </div>

    <div className="disney-news">
        <p className="news-text-1"><i>Get the latest news on Disney movies , apps and more !</i></p>
        <a href="https://play.google.com/store/apps/details?id=com.disney.disneyplus&hl=vi" target="_blank" rel="noopener noreferrer" className="go-to-apps">Go to Apps</a>
    </div>

    <div className="movie-section">
        <img src="https://i.pinimg.com/1200x/b0/5f/73/b05f7320abf03fc521e36806cda20309.jpg" alt="Inside Out Poster-1" className="movie-poster"/>
        <div className="movie-description">
            <h2 className="movie-title">Best movie of the year</h2>
            <p className="movie-text">
            The film explores the mind of a young girl named Riley Anderson, where five personified emotions—Joy, Sadness, Fear, Disgust, and Anger—live in Headquarters, the control center of her mind. When Riley's family moves to San Francisco, the turmoil of this major life change causes chaos in Headquarters, and Joy and Sadness get separated from the control center, leading them on an adventure through Riley's mind to restore balance.</p>
        </div>
    </div>

    <div className="awards-section">
        <div className="award-description">
        <h2 className="awards-heading">Awards won by Disney</h2>
        <ol className="awards-list">
            <li>
                <p>Academy Awards (Oscars)</p>
                <ul>
                    <li>Won: Best Animated Feature (at the 88th Academy Awards in 2016)</li>
                    <li>Nominated: Best Original Screenplay</li>
                </ul>
            </li>
            <li>
                <p>Annie Awards (The "Oscars" of Animation)<br />
                "Inside Out" dominated the 43rd Annie Awards, taking home a total of 10 wins, including:</p>
                <ul>
                    <li>Best Animated Feature</li>
                    <li>Outstanding Achievement for Directing (Pete Docter)</li>
                    <li>Outstanding Achievement in Writing</li>
                    <li>Outstanding Achievement for Voice Acting (Phyllis Smith as Sadness)</li>
                    <li>Outstanding Achievement for Music (Michael Giacchino)</li>
                </ul>
            </li>
        </ol>
        </div>
        <div className="awards-media">
            <img src="https://i.pinimg.com/736x/d0/3a/97/d03a978531064b3a43e2d9b5f3d2c9bc.jpg" alt="Inside Out 2 Awards Poster" className="award-image" />
            <a href="https://www.youtube.com/watch?v=LEjhY15eCx0" target="_blank" rel="noopener noreferrer" className="trailer-button">
            Click here to view Trailer
            </a>
            <img src="https://i.pinimg.com/736x/8e/d2/91/8ed291534626b63f3c106d4be14f0a9b.jpg" alt="Inside Out 2 Awards Poster" className="award-image" />
        </div>
    </div>

    <p className="news-text-2"><i>Where Dreams Come True</i></p>

    <div className="characters-section">
        <h2 className="section-title">Ours Characters</h2>
        <div className="characters-grid">
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/66/45/5e/66455e70a91a559d937b8cb4cf43696c.jpg" alt="Encanto"/>
                <p className="character-name">Encanto</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/fa/59/71/fa59710b2eaa3d4c779f00354a55ec7e.jpg" alt="Frozen"/>
                <p className="character-name">Frozen</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/8b/b1/d7/8bb1d77ec5b48b19011738e61d6ed32f.jpg" alt="Monsters University"/>
                <p className="character-name">Monsters University</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/e0/c5/71/e0c571035973e2f931b1d76f19b792ae.jpg" alt="Ratatouille"/>
                <p className="character-name">Ratatouille</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/ad/fe/4d/adfe4dff59e978a0d8113fd12023b406.jpg" alt="Up"/>
                <p className="character-name">Up</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/82/07/37/8207375c759f8927fb094a2af2a1656c.jpg" alt="Big Hero 6"/>
                <p className="character-name">Big Hero 6</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/66/a7/e5/66a7e59fc6d2b1e5c2998ed0c57d21fa.jpg" alt="Toy Story"/>
                <p className="character-name">Toy Story</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/50/51/12/505112aa17f60cf144ac3b56a0013a5c.jpg" alt="Finding nemo"/>
                <p className="character-name">Finding nemo</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/ef/ed/d1/efedd10ff3758acfb7e044c2a6277b1e.jpg" alt="Pinocchio"/>
                <p className="character-name">Pinocchio</p>
            </div>
            <div className="character-item">
                <img src="https://i.pinimg.com/736x/a6/22/30/a622301ffee1e64d8fef3a69078d979c.jpg" alt="Stitch"/>
                <p className="character-name">Stitch</p>
            </div><div className="character-item">
                <img src="https://i.pinimg.com/736x/54/05/56/54055692047f51e2c498ef4a340018af.jpg" alt="Chicken little"/>
                <p className="character-name">Chicken little</p>
            </div><div className="character-item">
                <img src="https://i.pinimg.com/736x/bc/f8/09/bcf809a37ec9c06aa52ac46d6e4fcfcd.jpg" alt="The lion king"/>
                <p className="character-name">The lion king</p>
            </div>
        </div>
    </div>

    <p className="news-text-3"><i>Disneyland</i></p>

    <section className="disney-section">
        <div className="top-row">
            <div className="disney-card">
                <img src="https://i.pinimg.com/736x/1b/49/1a/1b491a5f1816e05f426e56092d854a63.jpg" alt="How to go Disneyland" />
                <p>How to go Disneyland...</p>
                <span className="arrow">⬇</span>
            </div>
            <div className="disney-card">
                <img src="https://i.pinimg.com/1200x/5d/92/f2/5d92f2194cbb357c82466c508538e75e.jpg" alt="What's in Disneyland" />
                <p>What's in Disneyland</p>
                <span className="arrow">⬇</span>
            </div> 
            <div className="disney-card">
                <img src="https://i.pinimg.com/736x/0d/c9/3a/0dc93af3722c222c38e35647bb34137e.jpg" alt="Walt Disney Resort" />
                <p>Walt Disney Resort</p>
                <span className="arrow">⬇</span>
            </div>
        </div>
        <div className="video-thumbnail">
            <a
                href="https://www.youtube.com/watch?v=K21PDiTQ0JA"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://img.youtube.com/vi/K21PDiTQ0JA/maxresdefault.jpg"
                    alt="Disneyland Video"
                    className="youtube-preview"
                />
            </a>
        </div>
    </section>

    </>
  );
}
