const express=require("express");
const mongodb=require("mongoose")
const cors=require('cors')
const multer=require('multer')
const path=require('path');
const { type } = require("os");

const fs=require('fs').promises


const app=express()
app.use('/medias', express.static(path.join(process.cwd(), 'medias')));
app.use('/movie', express.static(path.join(process.cwd(), 'movie')));

app.use(cors({
    origin:"*",
    methods:["POST","GET","PATCH","DELETE","PUT"]
}))
const mongodbUrl="mongodb://localhost:27017/theatre"

mongodb.connect(mongodbUrl).then(()=>{
    console.log("Database connected  Successfully")
})
const schema=mongodb.Schema({
    trailer:String,
    poster:String,
    movie:{
        unique:true,
        type:String
    },
    release:String
})

const timeSchema=mongodb.Schema({
    time:{
        type:String,
        unique:true
    }
})
const dateSchema=mongodb.Schema({
    date:{
        type:String,
        unique:true
    }
})
const avlSchema=mongodb.Schema({
    movie:{
        unique:true,
        type:String
    },
    posterurl:String,
    prize:Number,
    showTime:Array,
    certificate:String
})
const snacks=mongodb.Schema({
    url:String,
    snack:{
        type:String,
        unique:true
    },
    stock:Number,
    price:Number

})
const userSchema=mongodb.Schema({
    username: String,
    userMail: String,
    userMobile:String,
    ticketPrize:Number,
    movie: String,
    date: String,
    time: String,
    seats: Array,
    snacks: Array,
    parkingsolt: Array,
})
const storage=multer.diskStorage({
    destination:function(req,file,cb){
         cb(null, path.join(process.cwd(), 'medias'));
    },
    filename:function(req,file,cb){
        const name=path.extname(file.originalname)
        const uni=req.body.url+name
        cb(null,uni)
    }

})
const upload=multer({storage})

const storage2=multer.diskStorage({
    destination:function(req,file,cb){
         cb(null, path.join(process.cwd(), 'movie'));
    },
    filename:function(req,file,cb){
        const name=path.extname(file.originalname)
        const uni=req.body.url+name
        cb(null,uni)
    }

})
const movie=multer({storage:storage2})
app.use(express.json())

const Users=mongodb.model('users',userSchema)
const Movies=mongodb.model('upcomming',schema)
const Time=mongodb.model('times',timeSchema)
const Day=mongodb.model('Days',dateSchema)
const Time2=mongodb.model('time2',timeSchema)
const Avl=mongodb.model('avaliableMovies',avlSchema)
const Snacks=mongodb.model('snacks',snacks)

app.listen(3000,()=>{
    console.log("server is running")
})

app.get('/adup',async (req,res)=>{
    const datas=await Movies.find()
    res.send(datas)
})

app.post('/adupchecking',async (req,res)=>{
    const datas=req.body; 
    const checking=await Movies.find(datas)
    res.send(checking)
})

app.post('/adup',upload.fields([
    {name:"poster",maxCount:1},
    {name:"trailer",maxCount:1}
]),async (req,res)=>{
    const datas=req.body
    const Url=req.protocol+"://"+req.host+"/medias/"
    const poster=Url+datas.url+path.extname(req.files.poster[0].originalname)
    const trailer=Url+datas.url+path.extname(req.files.trailer[0].originalname)
    const adding=new Movies({trailer,poster,movie:datas.movie,release:datas.release})
    await adding.save()
    res.status(200).send("Uploaded successfully")
}) 

app.delete("/adup/:id",async (req,res)=>{
    const deleting=await Movies.deleteOne({_id:req.params.id})
    const trailer_url=req.body.trailer
    const poster_url=req.body.poster
    let part1 = trailer_url.slice(trailer_url.lastIndexOf("/") + 1);
    let part2 = poster_url.slice( poster_url.lastIndexOf("/") + 1);
    const deleting2=await fs.unlink("./medias/"+part1)
    const deleting3=await fs.unlink("./medias/"+part2)
    res.send("Movie Successfully removed from Upcomming Section")
})
app.post("/adtime",async(req,res)=>{
    const datas=req.body;
    const adding=new Time(req.body)
    const adding2=new Time2(req.body)
    try{
        await adding.save()
        await adding2.save()
        res.send({msg:"Show time Added successfully"})
    }
    catch(err){
        if(err.code==11000){
            res.send({msg:"This time is already exist"})
        }
        else{
            res.send({msg:"Fail to add time"})
        }
    }
})
app.get("/adtime",async(req,res)=>{
    const datas=await Time.find();
    res.send(datas)
})

app.delete('/adtime',async(req,res)=>{
    const datas=req.body
    const deleting=await Time.deleteOne(datas)
     const deleting2=await Time2.deleteOne(datas)
    res.status(201).send("Show time deleted Successfully")
})
app.delete('/addate',async(req,res)=>{
    const datas=req.body
    console.log(datas)
    const deleting=await Day.deleteOne(datas)
    res.status(201).send("Show Date deleted Successfully")
})

app.post("/addate",async(req,res)=>{
    const datas=req.body;
    const adding=new Day(req.body)
    try{
        await adding.save()
        res.send({msg:"Show Date Added successfully"})
    }
    catch(err){
        if(err.code==11000){
            res.send({msg:"This Date is already exist"})
        }
        else{
            res.send({msg:"Fail to add Date"})
        }
    }
})
app.get("/addate",async(req,res)=>{
    const datas=await Day.find();

    res.send(datas)
})
app.get('/avl',async(req,res)=>{
    const dates=await Day.find()
    const Times=await Time2.find()
    const Movie=await Avl.find()
    res.send({dates,Times,Movie})

})

app.post('/avl',movie.single('poster'),async (req,res)=>{
    const datas=req.body
    console.log(datas)
    
    datas.date
    const Url=req.protocol+"://"+req.host+"/movie/"
    const poster=Url+datas.url+path.extname(req.file.originalname)
    const adding=new Avl({posterurl:poster,movie:datas.movie,showTime:JSON.parse(datas.showTimes),prize:datas.prize,certificate:datas.certificate})
    const timeing=JSON.parse(datas.showTimes)
    
    try{
        await adding.save()
        res.status(200).send("Uploaded successfully")
        await Promise.all(timeing.flatMap(eles =>eles.time.map(ele => Time2.deleteOne({ time: ele }))));

    }
    catch(err){
        if(err.code==11000){
            res.send('This Movie Name is Already Exist')
        }
        else{
            res.send("Some Thing went Wrong")
        }
    }
})
app.delete('/avl',async (req,res)=>{
    const datas=req.body 
    await Avl.deleteOne({movie:datas.movie})
    const time=datas.showTime
    await Users.deleteMany({movie:datas.movie})
    console.log(datas)
    console.log(time)
    
       if (Array.isArray(time)) {
      await Promise.all(
          time[0].time.map(singleTime => {
            console.log(singleTime)
            return new Time2({ time: singleTime }).save();
          })
        
      );
    }
    res.send("Movie Deleted Successfully")
     let part1 = datas.posterurl.slice(datas.posterurl.lastIndexOf("/") + 1);
     const deleting=await fs.unlink("./movie/"+part1)
})
app.post('/adfood',movie.single('img'),async (req,res)=>{
    const datas=req.body
    const Url=req.protocol+"://"+req.host+"/movie/"
    const poster=Url+datas.url+path.extname(req.file.originalname)
    const adding=new Snacks({url:poster,snack:datas.snack,stock:datas.stock,price:datas.price})
    
    try{
        await adding.save()
        res.status(200).send("Uploaded successfully")
    }
    catch(err){
        if(err.code==11000){
            res.send('This Snack is Already Exist')
        }
        else{
            res.send("Some Thing went Wrong")
        }
    }
})
app.delete('/adfood',async (req,res)=>{
    const datas=req.body 
    await Snacks.deleteOne({snack:datas.snack})
    console.log(datas)
    res.send("Snack Deleted Successfully")
     let part1 = datas.url.slice(datas.url.lastIndexOf("/") + 1);
     const deleting=await fs.unlink("./movie/"+part1)
})
app.get('/adfood',async(req,res)=>{
    const finding=await Snacks.find()
    res.send(finding)
    console.log(finding)
})
app.patch('/adfood',async(req,res)=>{
    const datas=req.body
    const qty=datas.a
    const finding=await Snacks.find()
    const usnack=datas.ele.snack
    const updating=await Snacks.updateOne({snack:usnack},{$inc:{stock:datas.a}})
    res.send("Your Snack Stocks modified Sucessfully")
    console.log(datas)
})
app.get('/ticket',async(req,res)=>{
    const getting=await Avl.find();
    res.send(getting)
})

app.get("/book",async(req,res)=>{
    const datas=req.query
    const finding=await Users.find({date:datas.date,time:datas.time})
    res.send(finding)
    console.log(finding)
})
app.post('/booked',async(req,res)=>{
    const datas=req.body;
    console.log(datas)
    await Promise.all(
        datas.snacks.map(ele=>{
        return Snacks.updateOne({snack:ele.snack},{$inc:{stock:-ele.qty}})
    })
    )
    const adding=new Users(datas);
    await adding.save()
    
    res.send({msg:"Ticket Booked successfully",ticketId:adding._id})
})
app.get('/admin',async(req,res)=>{
    const datas=await Users.find()
    
    res.send(datas)
})
app.post('/movies',async(req,res)=>{
    const movie=req.body.movie
    console.log(movie)
    const finding=await Avl.findOne({movie})
    res.send(finding)
})
app.delete('/delshow',async (req,res)=>{
    const movieName=req.body[0].movie
    const date=req.body[1]
    const time=req.body[2]
    console.log(movieName,date,time)
     const result = await Avl.updateOne(
      { movie: movieName, "showTime.date": date },
      { $pull: { "showTime.$.time": time } }
    );
    res.send('Show time removed Successfully') 
})
app.post('/dateDelete',async(req,res)=>{
    const datas=req.body
    const movieName=req.body.date[0].movie
    const date=req.body.date[1]
    console.log(date)
    console.log(movieName)
    await Avl.updateOne({movie:movieName},{$pull:{showTime:{date}}})
    res.send("Date Was Deleted Successfully")
})
app.get('/adbooked',async(req,res)=>{
    const date=await Day.find()
    const time=await Time.find()
    res.send({date,time})
})