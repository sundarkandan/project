import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [movie, setMovie] = useState({});
  const [user, setUser] = useState({});
  const [ticketId, setTicketId] = useState('');
  const[seats,setSeats]=useState([])
  const[snacks,setSnacks]=useState([])
  const[poster,setPoster]=useState('')
  const[parking,setParking]=useState([])
  useEffect(() => {
    const server=import.meta.env.VITE_SERVER
    const getting = location.state;
    axios.post(server+'movies',getting).then(res=>setPoster(res.data))
    console.log(getting)
    if(getting.user){
      setUser(getting.user);
    setMovie(getting.movie);
    setSeats(getting.user.seats )
    setSnacks(getting.user.snacks )
    setParking(getting.user.parkingsolt)
    setTicketId(getting.ticketId );
    }
    else{
      setUser(getting);
    setMovie(getting.movie);
    setSeats(getting.seats)
    setSnacks(getting.snacks)
    setParking(getting.parkingsolt)
    setTicketId(getting._id);
    }
   
  }, []);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f2f2f2",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px",
    },
    ticket: {
      width: "520px",
      borderRadius: "15px",
      background: "#fff",
      padding: "25px 30px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      position: "relative",
      overflow: "hidden",
      borderTop: "8px solid #4caf50",
    },
    header: { textAlign: "center", marginBottom: "20px" },
    movieTitle: { fontSize: "24px", fontWeight: "700", margin: 0, color: "#4caf50" },
    cinema: { fontSize: "16px", color: "#555", marginTop: "5px" },
    section: { marginBottom: "20px" },
    sectionTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "10px", color: "#333" },
    movieDetailsContainer: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
    detailsText: { display: "flex", flexDirection: "column", gap: "2px", color: "#444", fontSize: "14px" },
    poster: { width: "120px", height: "160px", borderRadius: "10px", objectFit: "cover", boxShadow: "0 3px 8px rgba(0,0,0,0.2)" },
    bookingId: { fontSize: "14px", color: "#333", fontWeight: "600", marginBottom: "8px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
    th: { textAlign: "left", padding: "5px 0", color: "#555", fontWeight: "600", fontSize: "14px" },
    td: { textAlign: "left", padding: "3px 0", fontSize: "14px", color: "#444" },
    subtotalRow: { marginTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "15px", color: "#333" },
    grandTotalRow: { marginTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "16px", color: "#4caf50" },
    footer: { marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#888" },
  };

  return (
    <div style={styles.container} className="fcol">
      <center><button className="btn noprint mb-2" onClick={()=>{window.print()}}>Print</button></center>
      <div style={styles.ticket}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.movieTitle}>{"Movie Mansion"}</h2>
          <p style={styles.cinema}><b>Movie Name: {movie.movie || user.movie}</b></p>
        </div>

        {/* Booking ID */}
        <div style={styles.bookingId}><strong>Booking ID:</strong> {ticketId }</div>

        {/* Movie Details */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Movie Details</div>
          <div style={styles.movieDetailsContainer}>
            <div style={styles.detailsText}>
              <p><strong>Date:</strong> {user.date}</p>
              <p><strong>Time:</strong> {user.time}</p>
              <p><strong>Ticket Prize:</strong> ₹{movie.prize || user.ticketPrize}</p>
              <p><strong>Certificate:</strong> {movie.certificate || poster.certificate}</p>
              <p><strong>Seat:</strong> {seats.join(', ')}</p>
            </div>
            <img
              src={movie.posterurl || poster.posterurl}
              alt="Poster"
              style={styles.poster}
            />
          </div>
        </div>

        {/* Food & Parking (Static Template) */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Food & Parking</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Price</th>
              </tr>
            </thead>
            <tbody>
              {
                snacks.map((ele,idx)=>{
                    return(
                        <tr>
                <td style={styles.td}>{ele.snack}</td>
                <td style={styles.td}>{ele.qty}</td>
                <td style={styles.td}>₹{ele.prize*ele.qty}</td>
              </tr>
                    )
                })
              }
              {
                parking.map((ele,idx)=>{
                         return(
                        <tr>
                <td style={styles.td}>Parking Slot No: {ele}</td>
                <td style={styles.td}>1</td>
                <td style={styles.td}>₹50</td>
              </tr>
                    )
                })
              }
              
            </tbody>
          </table>

          {/* Subtotals */}
          <div style={styles.subtotalRow}>
            <span>Food & Parking Total:</span>
            <span>₹{snacks.reduce((a,c)=>a+c.prize*c.qty,0)+parking.reduce((a,c)=>a+50,0)}</span>
          </div>
          <div style={styles.subtotalRow}>
            <span>Ticket Price:</span>
            <span>₹{movie.prize*seats.length || user.ticketPrize*seats.length}</span>
          </div>

          {/* Grand Total */}
          <div style={styles.grandTotalRow}>
            <span>Grand Total:</span>
            <span>₹{snacks.reduce((a,c)=>a+c.prize*c.qty,0)+parking.reduce((a,c)=>a+50,0)+movie.prize*seats.length ||snacks.reduce((a,c)=>a+c.prize*c.qty,0)+parking.reduce((a,c)=>a+50,0)+user.ticketPrize*seats.length} </span>
          </div>
        </div>

        <div style={styles.footer}>
          Enjoy your movie! Keep this ticket for entrance & parking.
        </div>
      </div>
      
    </div>
  );
}

export default Layout;
