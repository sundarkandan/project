import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation,useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from "react-toastify";
function Foods(){
    const server=import.meta.env.VITE_SERVER
    var[disp,setDisp]=useState("none")
    const[Snacks,setSnacks]=useState([])
   const [qty, setQty] = useState([]);
   var[cart,setCart]=useState([])
   const navigate=useNavigate()
   var[total,setTotal]=useState(0)
   const location=useLocation();
   const [user,setUser]=useState([])
   const [movie,setMovie]=useState([])
   useEffect(()=>{
        const getted=location.state;
        setMovie(getted.movie)
        setUser(getted.user)

        axios.get(server+'adfood').then(res=>{setSnacks(res.data)
            console.log(res.data)
            setQty(Array(res.data.length).fill(0))
        })
    },[])
    function handleNavigation(con){
    if(cart.length==0 && con){
        toast.error("Please Select the Food First Or Click 'Proceed without Food'")
    }
    else{
        console.log("called")
        const updated={ ...user, snacks: cart }
        setUser(updated);
        console.log(updated)
        navigate('/parking',{state:{movie,user:updated}})
    }
    }
    return(
        <>
       <div className="fixed-top flex">
         <button onClick={()=>{setDisp("flex")}} className="btn bg-transparent ms-auto mt-3 me-3"><img src="https://cdn-icons-png.flaticon.com/128/3643/3643914.png" width="30px" alt="" /></button>

       </div>
       <div className="position-absolute w-100">
        
        <div style={{display:disp}} className="cart-items flex me-2 fcol mt-5 ms-auto">
            <div className="ms-auto w-100 mb-auto me-3 flex">
                <h1 className="me-auto ms-2">Cart Items</h1>
                <button className="btn me-2" onClick={()=>{
                    setDisp("none")
                    
                    }}>X</button>
            </div>
            <div className="items mb-auto w-100">
                    <table className="w-100">
                       <tbody>
                         <tr align="center">
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Prize</th>
                            <th>Remove</th>
                        </tr>
                       {
                        cart.map((ele)=>{
                                
                            return(
                                 <tr className="item" align="center">
                            <td>{ele.snack}</td>
                            <td>{ele.qty}</td>
                            <td>{ele.prize*ele.qty}</td>
                            <td><button className="btn del" onClick={()=>{
                                setCart(cart.filter((e,i)=>e!==ele))
                                cart.map((e,i)=>e==ele?setTotal(total-=ele.prize*ele.qty):setTotal(total))
                            }}>X</button></td>
                        </tr> 
                            )
                        })
                    } 
                    
                        </tbody>               
                    </table>
            </div>
        </div>
       </div>
        <div className="container mt-5 cont100">
            <div className="row">
                <center><h1 className="display-4" data-aos="fade-up">Avaliable Snacks</h1></center>
            </div>
            <div className="row mt-5">
                <div className="col-12 cont flex">
                    {
                        Snacks.map((ele,idx)=>{
                            
                          return(
                              <div data-aos="zoom-out" className="cards p-3 fcol flex">
                        <div className="imgs imgs2"style={{backgroundImage:`url(${ele.url})`}}></div>
                        <h6 className="text-white">{ele.snack}</h6>
                        <h4 className="fw-bolder">₹{ele.price}</h4>

                       <div className="flex pb-2 gap-3">
                        <h2>Qty</h2>
                         <button className="btn" onClick={()=>{
                            
                            setQty(prev=>prev.map((q,i)=>i===idx?q+1:q));
                            }}>+</button>
                       <h5>{qty[idx]}</h5>
                        <button className="btn"  onClick={()=>{
                        
                            setQty(prev=>prev.map((q,i)=>i===idx?Math.max(q-1,0): q));
                            }}>-</button></div>
                        <button className="btn" onClick={()=>{
                            
                            if(!ele.snack || qty[idx] === 0){
                                toast.error("Please Select any one Snack")
                            }
                           else{
                             toast.success("Snack Added to the Cart")
                                setCart((prev)=>{
                                const filtered = prev.filter(item => item.snack !== ele.snack);
                                const newItem = { snack: ele.snack, qty: qty[idx], prize: ele.price };
                                return [...filtered, newItem];
                            })
                           cart.map(eles=>{
                            setTotal(total+=eles.price*eles.qty)
                           })
                           }
                            }}>Add To Cart</button>
                    </div> 
                          )
                        })
                    }
                </div>
            </div>
        </div>
        <div className="purchase-info flex  fixed-bottom">
            <button onClick={()=>handleNavigation(false)} className="ms-2 btn">Proceed Without Snacks</button>
                  
            <h1 className="ms-auto me-5">Prize:₹{cart.reduce((acc, ele) => acc + ele.prize * ele.qty, 0)}</h1>
            <button className="btn me-3" onClick={()=>handleNavigation(true)}>Next</button>
            
        </div>
        </>
    )
}
export default Foods;