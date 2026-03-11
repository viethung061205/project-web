import '../index.css'
export default function About() {
  return (
    <div className="about-page">
      <div className="about-banner">
        <h1>The Walt Disney Company</h1>
      </div>

      <div className="about-section section-1-2">
        <div className="image-side">
          <img src="https://i.pinimg.com/736x/fe/8c/74/fe8c749885d884fedfd026e03a4d228b.jpg" alt="Walt Disney and Mickey" />
        </div>
        <div className="text-side">
          <h2>Foundation and Early Beginnings</h2>
          <p>
            The Walt Disney Company, initially called the Disney Brothers Cartoon Studio, was founded on October 16, 1923, in Los Angeles, California, by the brothers Walt Disney and Roy O. Disney. The venture began as a small animation studio. Their first successful output was the Alice Comedies series, which combined live-action with animation.          </p>
        </div>
      </div>
        <h2 className='special'>The Animation Revolution and Diversification</h2>
      <div className="about-section section-2-1">
        <div className="text-side">
          
          <p>
            In 1937, Walt Disney took an enormous risk by producing Snow White and the Seven Dwarfs the 1st full-length animated feature film in American cinema history. Snow White's resounding artistic and commercial success provided the financial foundation for the studio's future. The company further diversified in 1955 with the opening of Disneyland in California, transitioning the studio from solely a film company into a comprehensive entertainment corporation.          </p>
        </div>
        <div className="image-side">
          <img src="https://i.pinimg.com/736x/04/3a/ed/043aed1e23eea8fe4f9b893c07fb4406.jpg" alt="Snow White" />
        </div>
      </div>

      <div className="about-section section-grid">
        <div className="text-top">
          <h2>Legacy and Global Empire</h2>
          <p>
            Over the following decades, The Walt Disney Company continued to expand through acquisitions and innovation, growing into one of the world's largest and most influential media and entertainment conglomerates, headquartered in Burbank, California, and becoming a dominant force in global popular culture.          </p>
        </div>
        <div className="image-row">
          <img src="https://i.pinimg.com/1200x/d8/f2/db/d8f2db88fd43195b2a6985eeab74940b.jpg" alt="Disneyland 1" />
          <img src="https://i.pinimg.com/736x/bd/bf/fb/bdbffbc5df0fd4098a3f1d2a27e96798.jpg" alt="Disneyland 2" />
        </div>
      </div>

    </div>
  );
}


