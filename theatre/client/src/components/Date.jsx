import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Dates() {
  const location = useLocation();
  const navigate = useNavigate();
  const[conditions,setConditions]=useState({})
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [disp, setDisp] = useState("none");
  const[movie,setMovie]=useState([])
  const [user, setUser] = useState({
    username: "",
    userMail: "",
    userMobile:"",
    ticketPrize:0,
    movie: "",
    date: "",
    time: "",
    seats: [],
    snacks: [],
    parkingsolt: [],
  });

  useEffect(() => {
    const getted = location.state;
    console.log(getted)
    setConditions(getted.tickets)
    if (getted?.tickets) {
      setMovie(getted)
      setDates(getted.tickets.showTime.map(ele=>ele.date) || []);
      setTimes(getted.tickets.showTime[0].time.map(ele=>ele) || []);
      setUser((prev) => ({ ...prev, movie: getted.tickets.movie }));
      setUser((prev)=>({...prev,ticketPrize:getted.tickets.prize}))
    }
  }, []);

  const handleDateClick = (ele) => {
    console.log(ele)
    console.log(times)
    const filtered=conditions.showTime.filter(eles=>eles.date==ele)
    console.log("filtered",filtered)
    setTimes(filtered[0].time)
    setUser((prev) => ({ ...prev, date: ele }));
    setDisp("flex");
  };


  const handleTimeClick = (ele) => {

    console.log(ele)
    const updatedUser = { ...user, time: ele };
    setUser(updatedUser); 
    navigate("/book", { state: {updatedUser,movie}});
  };

  return (
    <div className="container flex fcol cont100">
      <h1>Select the Date Of the Movie</h1>

      <div className="dates flex">
        {dates && dates.length > 0
          ? dates.map((ele, index) => (
              <div
                key={index}
                className="date flex"
                onClick={() => handleDateClick(ele)}
              >
                <h5 className="text-white">{ele}</h5>
              </div>
            ))
          : ""}
      </div>

      <h1 style={{ display: disp }} className="mt-5">
        Select the Time Of the Movie
      </h1>

      <div className="times flex">
        {times && times.length > 0
          ? times.map((ele, index) => (
              <div
                key={index}
                style={{ display: disp }}
                className="time flex"
                onClick={() => handleTimeClick(ele)}
              >
                <h5 className="text-white">{ele}</h5>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
}

export default Dates;
