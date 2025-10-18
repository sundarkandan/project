import { useState } from "react";
import { toast } from "react-toastify";
import { Form, Link } from "react-router-dom";
import axios from 'axios'
import { useEffect } from "react";
function Foods(){
  const server=import.meta.env.VITE_SERVER
  const [foods,setFoods]=useState([])
  useEffect(()=>{
    axios.get(server+"adfood").then(res=>{
      setFoods(res.data)
    })
  },[])
     var[display1,setDisplay1]=useState("none")
      var [display, setDisplay] = useState(["none", "block"]);

      var[img,setImg]=useState(null)
      var[snack,setSnack]=useState('')
      var[stock,setStock]=useState(0)
      var[price,setPrice]=useState(0)

      async function sending(){
        const forms=new FormData()
        forms.append('url',Date.now())
        forms.append('img',img)
        forms.append('snack',snack)
        forms.append('stock',stock)
        forms.append('price',price)

        await axios.post(server+"adfood",forms).then(res=>{
          toast.success(res.data)
        })
         await axios.get(server+"adfood").then(res=>{
      setFoods(res.data)
    })
      }
      async function deleting(element){
        await axios.delete(server+'adfood',{data:element}).then(res=>{
          toast.success(res.data)
        })
        await axios.get(server+"adfood").then(res=>{
      setFoods(res.data)
    })
      }
        return(
            <>
             <div onClick={() => {
                      setDisplay((prev) => {
                        const newDisplay = [...prev];
                        newDisplay[0] = "flex";
                        newDisplay[1]="none"
                        return newDisplay;
                      });
                    }} className="add flex">+</div>
          <div style={{display:display[0]}} className="container flex cont100">
       <div className="boxesAdup container ">
        <div className="row flex mt-5">
            <div className="col-8">
             <center><h1>Enter the Details</h1></center>
            </div>
          </div>
        
          <div className="row flex">
            <div className="col-8">
              <label htmlFor="" className="form-label">Please select a Portrait Food Image</label>
              <input type="file" onChange={(e)=>{setImg(e.target.files[0])}} className="form-control form2 w-100" />
            </div>
          </div>
         
          <div className="row flex">
            <div className="col-8">
              <label htmlFor=""  className="form-label">Snack Name</label>
              <input type="text" onChange={(e)=>{setSnack(e.target.value)}} className="form-control form2 w-100" />
            </div>
          </div>
          <div className="row flex">
            <div className="col-8">
              <label htmlFor="" className="form-label">Snack Prize</label>
              <input type="number" onChange={(e)=>{setPrice(e.target.value)}} className="form-control form2 w-100" />
            </div>
          </div><div className="row flex ">
            <div className="col-8">
              <label htmlFor="" className="form-label">Stocks</label>
              <input type="Number" onChange={(e)=>{setStock(e.target.value)}} className="form-control form2 w-100" />
            </div>
          </div>

        

          <div className="mt-4 gap-5 flex">
            <button className="btn" onClick={sending}>Submit</button> <button className="btn"  onClick={() => {
                      setDisplay((prev) => {
                        const newDisplay = [...prev];
                        newDisplay[1] = "block";
                        newDisplay[0]="none"
                        return newDisplay;
                      });
                    }} >Cancel</button>
          </div>
       </div>
    </div>
          
            <div style={{display:display[1]}} className="container mt-5 cont100">
                <div className="row">
                    <center><h1 className="display-4" data-aos="fade-up">Avaliable Snacks</h1></center>
                </div>
                <div className="row mt-5">
                    <div className="col-12 cont flex">
                      {
                        foods&&foods.length==0?<center><h1 className="text-secondary">No Foods Entered Please Enter the Foods</h1></center>:
                        foods.map((ele)=>{
                          return(
                              <div data-aos="zoom-out" className="cards fcol flex p-2">
                            <div className="imgs imgs2"style={{backgroundImage:`url(${ele.url})`}}></div>
                            <h6 className="text-white mt-2">{ele.snack}</h6>

                            <h4 className="fw-bolder">₹{ele.price}</h4>
                            <h6 className=" text-white">{ele.stock<=0?0:ele.stock} Stocks Left</h6>
                           <div className="flex gap-2"> <button className="btn" onClick={async ()=>{
                            const a=parseInt(prompt("Enter the stocks"))
                            console.log(a)
                            if(!a){
                              toast.error("Empty Value is Not Allowed Please Enter the stocks")
                            }
                            else{
                              await axios.patch(server+'adfood',{a,ele}).then((res)=>{
                                toast.success(res.data)
                              })
                            }
                            await axios.get(server+"adfood").then(res=>{
                             setFoods(res.data)
                             })
                           }}>Add Stocks</button>

                           <button className="btn" onClick={async ()=>{
                            const a=parseInt(prompt("Enter the stocks"))
                            console.log(a)
                            if(!a){
                              toast.error("Empty Value is Not Allowed Please Enter the stocks")
                              return ;
                            }
                            if(ele.stock<a){
                              console.log(ele)
                              await axios.delete(server+'adfood',{data:ele}).then((res)=>{
                                toast.success(res.data)
                              })
                              
                            }
                            else{
                              await axios.patch(server+'adfood',{a:-a,ele}).then((res)=>{
                                toast.success("success")
                              })
                            }
                            await axios.get(server+"adfood").then(res=>{
                             setFoods(res.data)
                             })
                           }}>Remove Stocks</button>
                        </div> 
                            <button className="btn bg-danger mt-2" onClick={()=>deleting(ele)}>Delete</button></div>
                          )
                        })
                      } 
                    </div>
                </div>
            </div>
           
            </>
        )
}
export default Foods;