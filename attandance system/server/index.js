    const express=require("express");
    const mongodb=require("mongoose")
    const app=express();
    const cors=require("cors")
    const bcrypt=require("bcrypt")
    app.use(cors({
        origin:"*",
        methods:['POST','GET','PUT','DELETE']
    }))

    app.use(express.json())

    const mongodbUrl="mongodb://localhost:27017/merit"

    const schema=mongodb.Schema({
        name:String,
        dob:String,
        rollno:{
            type:Number,
            required:true,
            unique:true
        },
        gender:String,
        dept:String,
        batch:Number,
        attendance:Array
    })
    const deptschema=mongodb.Schema({
        dept:{
            type:String,
            unique:true
        }
    })
    const batch=mongodb.Schema({
        batch:{
            type:Number,
            unique:true
        }
    })
    const presents=mongodb.Schema({
        rollno:Number,
        id:String,
        date:String,
        name:String,
        dept:String,
        batch:Number,
        attendance:Array
    })
    presents.index({ rollno: 1, date: 1 }, { unique: true })
    const Day=mongodb.Schema({
        today:{
            type:String, 
            unique:true
        },
        dept:String,
        year:Number
    })
    const pass=mongodb.Schema({
        pass:String
    })
    const permanentSchema=mongodb.Schema({
        batch:Number,
        dept:String,
        sem:Number,
        datas:Array
    })
        permanentSchema.index({ batch: 1, dept: 1 ,sem:1}, { unique: true })
    const Days=mongodb.model('days',Day)
    const attendance=mongodb.model('students',schema)
    const dept=mongodb.model('dept',deptschema);
    const batchs=mongodb.model('batch',batch)
    const presenting=mongodb.model('present',presents)
    const password=mongodb.model("pass",pass)
    const permanent=mongodb.model("history",permanentSchema)
    mongodb.connect(mongodbUrl).then(()=>{
        console.log("db connected successfully")
    })

    app.listen(3000,()=>{
        console.log("app is running")
    })

    app.post('/addbatch',async (req,res)=>{
        const data=req.body;
        // console.log(data)
        try{
        if(data){
            const create=new batchs(data);
            await create.save();
            res.send("new batch registered successfully")
        }
        else{
            res.send('batch is not created somthing went wrong')
        }
        }
        catch(err){
            res.send(data.batch+' batch already exist')
        }
    })
    app.post('/addDepartment',async (req,res)=>{
        const data=req.body;
        // console.log(data)
        try{
        if(data){
            const create=new dept(data);
            await create.save();
            res.send("Department registered successfully")
        }
        else{
            res.send('Department is not created somthing went wrong')
        }
        }
        catch(err){
            res.send(data.batch+' batch already exist')
        }
    })
    app.post('/newstudentregister',async (req,res)=>{
        const data=req.body;
        try{
            const create=new attendance(data);
            const c=await create.save();
            res.send("Student Registerd Successfully")
        }
        catch(err){
            if(err.code==11000){
                const f=await attendance.find({rollno:data.rollno})
                res.send("this roll number is already allocated for "+f[0].name)
            }
            res.send('error')
        }
    })
    app.get('/newstudent',async (req,res)=>{
        var getBatch=await batchs.find();
        var getDept=await dept.find()
        res.send({batch:getBatch,dept:getDept});
    })
    app.get('/alterStudent',async(req,res)=>{
        const getting=await attendance.find();
        const getting2=await Days.find();
        res.send({getting,getting2});
    })
    app.put('/alterStudent/:id',async (req,res)=>{
        const id=req.params.id;
        const datas=req.body;
        console.log({name:datas.name,rollno:datas.rollno,dept:datas.dept,batch:datas.batch})
        try{
            if(id && datas){
                const updating=await attendance.updateOne({_id:id},{$set:datas})
                const updating2=await presenting.updateMany({id:id},{$set:{name:datas.name,rollno:datas.rollno,dept:datas.dept,batch:datas.batch}})

                res.send(datas.name+" was altered successfully")
                // console.log(updating)
            } 
            else{
                res.send("Student not altered Somthing went Wrong")
            }
        }
        catch(err){  
            console.log(err.code)
            res.send("Roll No already exist")
        }
    })    
    app.get('/finded',async (req,res)=>{
        const datas=req.query;
    if(datas.con=='dept'){
        const finding1=await attendance.find({dept:datas.data})
        res.send(finding1)
    }
    if(datas.con=='year'){
        const finding2=await attendance.find({batch:datas.data})
        res.send(finding2)
    }
    if(datas.con=='two'){
        const dept = req.query['data[dept]'];
        const batch = parseInt(req.query['data[batch]']);
        const finding3=await attendance.find({batch,dept})
        res.send(finding3)
    }
    })
    app.post('/newattendance', async (req, res) => {
  try {
    const students = req.body.Student;
    const present = req.body.present;
    const role = req.body.role;

    // Validating presence of required data
    if (!Array.isArray(students) || !Array.isArray(present)) {
      return res.send("Invalid data format for students or present list.");
    }

    // Create update operations
    const updates = students
      .map((student, idx) => {
        const date = present[idx]?.date;
        const rollno = student?.rollno;

        if (date && rollno != null) {
          return {
            updateOne: {
              filter: { rollno: rollno, date: date },
              update: {
                $set: {
                  id: student._id,
                  name: student.name,
                  dept: student.dept,
                  batch: student.batch,
                  attendance: present[idx].present
                }
              },
            }
          };
        }
        return null;
      })
      .filter(Boolean); // Remove nulls

    // Create insert operations
    const inserts = students
      .map((student, idx) => {
        const date = present[idx]?.date;
        const rollno = student?.rollno;

        if (date && rollno != null) {
          return {
            insertOne: {
              document: {
                id: student._id,
                date: date,
                rollno: rollno,
                attendance: present[idx].present,
                batch: student.batch,
                dept: student.dept,
                name: student.name,
              },
            }
          };
        }
        return null;
      })
      .filter(Boolean); // Remove nulls

    // Handle staff insert
    if (role === "staff") {
      if (inserts.length === 0) return res.send("No valid data to insert.");
      await presenting.bulkWrite(inserts)
        .then(() => res.send("Today's attendance completed."))
        .catch(err => {
          if (err.code === 11000) {
            res.send("Given Date Of attendance was Already registered");
          } else {
            console.error("Insert error:", err);
            res.send("Something went wrong while saving attendance.");
          }
        });
    }

    // Handle admin update
    else if (role === "admin") {
      if (updates.length === 0) return res.send("No valid data to update.");
      const check = await presenting.bulkWrite(updates);
      if (check.modifiedCount === 0) {
        res.send("Student record not found. Double check your given date?");
      } else {
        res.send("Students Attendance was modified Successfully");
      }
    }

    else {
      res.send("Invalid role provided.");
    }

  } catch (err) {
    console.error("Attendance error:", err);
    res.send("Something went wrong while recording attendance.");
  }
});

    app.post("/days",async (req,res)=>{
        const dat=req.body
        try{
            const adding=new Days(dat);
            await adding.save(); 
        }
        catch(err){
            if(err.code=="11000"){
                console.log('duplicate error')
            }
        }
    })
    app.post("/prestudent",async (req,res)=>{
        const datas=req.body;
        const getting2=await Days.find();
        const getting=await Promise.all(
            datas.map(async (ele,idx)=>(
                await presenting.find({rollno:ele.rollno})
            ))
        )
        res.send({getting,getting2})
    })
    app.get("/delattendance",async(req,res)=>{
        const getting1=await Days.find()
        const getting2=await presenting.find()
        if(getting2 && getting1){
            res.send({getting1,getting2,msg:'fetched successfully'})
        }
        else{
            res.send({msg:'cannot fetched successfully'})
        }
    })
    app.delete("/delattendance",async(req,res)=>{
        const data=req.body
        // console.log(data)
        const getting1=await Days.deleteOne(data)
        const getting2=await presenting.deleteMany({date:data.today,dept:data.dept,batch:data.year})
        if(getting2 && getting1){
            res.send({getting1,getting2,msg:'fetched successfully'})
        }
        else{
            res.send({msg:'cannot fetched successfully'})
        }
    })
    app.delete('/deleterecords',async(req,res)=>{
        try{
        const del=await presenting.deleteMany({});
        const del2=await Days.deleteMany({})
        // console.log(del)
        if(!del.deletedCount==0 || !del.deletedCount==0){
            res.send('Metioned records are deleted successfully')
        }
        else{
            res.send("Your metioned data was not found")
        }
        }
        catch(err){
            // console.log(err)
        }
    })
    app.delete('/studentdeletes',async(req,res)=>{
        try{
            const datas=req.body;
        // console.log(datas)
        const del=await presenting.deleteMany({dept:datas.dept,batch:datas.batch});
        const del3=await attendance.deleteMany({dept:datas.dept,batch:datas.batch})
        // console.log(del )
        if(!del.deletedCount==0){
            res.send('Metioned records are deleted successfully')
        }
        else{
            res.send("Your metioned data was not found")
        }
        }
        catch(err){
            // console.log(err)
        }
    })
    app.delete('/deleteone',async(req,res)=>{
        try{
            const datas=req.body;
        // console.log(datas._id)
        const del=await presenting.deleteMany({rollno:datas.rollno});
        const del2=await attendance.deleteMany({_id:datas._id})
        if(!del.deletedCount==0 || !del2.deletedCount==0){
            res.send('Metioned records are deleted successfully')
        }
        else{
            res.send("Your metioned data was not found")
        }
        }
        catch(err){
            // console.log(err)
        }
    })
    app.post('/home',async (req,res)=>{
        const user=req.body;
        const passing=await password.find()
        const compareing=await bcrypt.compare(user.pass,passing[0].pass)
        res.send({result:compareing,msg:compareing?"success":"password is Wrong"})
    })
app.post("/passchange",async (req,res)=>{
    const currentPassword=req.body.current;
    const newPassword=req.body.newp;
    const hashedp=await bcrypt.hash(newPassword,10)
    const passing=await password.find()
    // console.log(passing[0]._id)
    const compareing=await bcrypt.compare(currentPassword,passing[0].pass)
    if(compareing){
        const modifying=await password.updateOne({_id:passing[0]._id},{pass:hashedp});
        res.send({msg:"Your Password is changed successfully"})
    }
    else{
        res.send({msg:"Your Current Password is wrong"})
    }
    if(currentPassword==newPassword){
        res.send({msg:"current admin password is not consider as new admin password"})
    }
    // console.log(currentPassword,newPassword) 
})
app.get('/missing',async(req,res)=>{
    const student=await attendance.find()
    const days=await Days.find()
    const present=await presenting.find()
    res.send({student,days,present})
})
app.post('/permenant',async (req,res)=>{
    const getted=req.body
    // console.log(getted)
    const createing=await permanent.updateOne(
  { batch: getted.batch, dept: getted.dept, sem: getted.sem },
  { $set: { datas: getted.datas } },
  { upsert: true }
);
res.send("Data saved or updated permanently");

})
app.post('/checkpermenant',async (req,res)=>{
    const datas=req.body;
    const finding=await permanent.findOne(datas)
    // console.log(finding)
    res.send(finding)
})