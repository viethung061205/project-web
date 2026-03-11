import '../index.css';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-logo">
          <Link to="/"><img src="/disney-logo.png" alt="Disney" /></Link>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <Link to='/about' className='footer-text'>About us</Link>
            <p>Disneyland</p>
            <p>Disney Shop</p>
          </div>

          <div className="footer-column">
            <p>Privacy Policy</p>
            <p>Help FAQs</p>
            <p>Contact us</p>
          </div>
        </div>

        <div className="footer-social">
          <a href="#"><img src="https://i.postimg.cc/FsmrbRVK/communication.png" alt="Facebook" className='icon-facebook'/></a>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" alt="Instagram" className='icon-instagram'/></a>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email" className='icon-email'/></a>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/159/159832.png" alt="Phone" className='icon-phone'/></a>
        </div>

      </div>

      <div className="footer-bottom">
        © Disney © Disney/Pixar © ™ Lucasfilm Ltd. © Marvel, Disney Entertainment
      </div>
    </footer>
  );
}
