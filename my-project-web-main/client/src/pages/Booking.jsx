import "./Booking.css";
import { useNavigate } from "react-router-dom";

const locations = [
  {
    id: "paris",
    name: "PARIS",
    img: "https://framerusercontent.com/images/GRCANQ8lb09NH3ijt4GGN3pzz4c.png"
  },
  {
    id: "tokyo",
    name: "TOKYO",
    img: "https://i.pinimg.com/1200x/b9/de/f4/b9def46f4a7db9cb87e341baf45df05a.jpg"
  },
  {
    id: "california",
    name: "CALIFORNIA",
    img: "https://i.pinimg.com/736x/a5/40/5b/a5405b9f6ff4b5e8ba26302fd9c7f02d.jpg"
  },
  {
    id: "shanghai",
    name: "SHANGHAI",
    img: "https://i.pinimg.com/1200x/c7/d1/ac/c7d1ac1c96cf8b166ad1f6db2ae91947.jpg"
  },
  {
    id: "hongkong",
    name: "HONGKONG",
    img: "https://i.pinimg.com/736x/0b/1f/60/0b1f604a3dba6faab603b06aafabe77f.jpg"
  }
];

const extraImage = "/disney-image.png";

const Booking = () => {
  const navigate = useNavigate();

  return (
    <div className="book-container">
      <div className="location-grid">
        {locations.map((loc, index) => (
          <div key={index} className="location-card" onClick={() => navigate(`/booking/${loc.id}`)}>
            <img src={loc.img} alt={loc.name} />
            <p className="location-name">{loc.name}</p>
            <p className="book-btn">Book ticket now &gt; &gt;</p>
          </div>
        ))}

        <div className="location-card image-only">
          <img src={extraImage} alt="Disney glove" />
        </div>
      </div>

      <div className="description-section">
        <div className="description-top">
          <p>
            Disneyland brings classic fairy tales and beloved Disney characters from the screen to life, creating a magical world that everyone dreams of seeing and exploring. Here, visitors can meet Mickey Mouse, Cinderella, Elsa, and many other characters in meticulously designed settings, such as Sleeping Beauty Castle or Frozen's Arendelle town. Every detail in the park is taken care of, giving visitors the feeling of stepping into a vivid comic book.
          </p>

          <img
            className="right-img"
            src="https://i.pinimg.com/1200x/d2/5b/35/d25b354f2a1ae4c0228b54835da5dcb4.jpg"
            alt="Disney characters"
          />
        </div>

        <div className="description-bottom">
          <img
            className="left-img"
            src="https://i.pinimg.com/1200x/2b/54/5d/2b545d2e48855ced72ec198a11e7463e.jpg"
            alt="Disney map"
          />
          <p>
            Disneyland is divided into many different themed areas, meeting the
            diverse interests of visitors. Fantasyland is a place for those who
            love fairy tales, with experiences such as traveling on Peter Pan's
            boat or exploring Snow White's house. In addition, Tomorrowland takes
            you to the future world with games inspired by modern technology and
            space, notably Space Mountain or Star Wars. Meanwhile, Adventureland
            is where visitors try their hand at exciting adventures. Main Street
            U.S.A. recreates the image of America in the early 20th century.
          </p>
        </div>

        <p className="final-paragraph">
          At Disneyland, you can enjoy a variety of rides that are suitable for
          all ages. From gentle rides like the King Arthur Carrousel for little
          ones, to thrilling rides like the Big Thunder Mountain Railroad roller
          coaster or virtual reality adventures in Star Wars: Galaxy's Edge.
        </p>

  <div className="ride-images-layout">
  <div className="left-section">
    <div className="left-grid">
      <div className="left-small-images">
        <img src="https://i.pinimg.com/1200x/55/a0/9f/55a09f15661b3e08adcec108c6dfc862.jpg" />
        <img src="https://i.pinimg.com/736x/14/23/9a/14239a9e5b4a44c0bbaf120859fd97cd.jpg" />
      </div>
      <div className="left-tall-image">
        <img src="https://i.pinimg.com/736x/c3/03/2c/c3032c5de0460f607afa9e076b2d918c.jpg" />
      </div>
    </div>
  </div>

  <div className="right-section">
    <div className="right-top">
      <img src="https://i.pinimg.com/1200x/ab/b3/b8/abb3b85265c6a41dfd48832430517e5f.jpg" />
      <img src="https://i.pinimg.com/736x/7f/b9/0c/7fb90c88c5027e2ec4670f891af7d477.jpg" />
    </div>
    <div className="right-bottom">
      <img src="https://i.pinimg.com/736x/d4/d5/69/d4d569f4a7ca95d7b9314ca8062ad08b.jpg" />
      <img src="https://i.pinimg.com/736x/68/eb/bd/68ebbdbd796883c6b88120588e435073.jpg" />
      <img src="https://i.pinimg.com/736x/94/24/6b/94246b12a2f2d2d1780a28dda66a7121.jpg" />
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default Booking;
