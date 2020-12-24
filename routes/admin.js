var express = require('express');
var router = express.Router();
var studentHelper = require("../helpers/student-helpers")
var fs =require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard');

});

router.get('/search-student',(req,res)=>{
  res.render('admin/search-student')
})


router.post('/search-student',(req,res)=>{
  let query=req.body
  let searchData={};
  if(query.AdmissionNo!=""){
    searchData.AdmissionNo=query.AdmissionNo
  }
  if(query.Name!=""){
    searchData.Name=query.Name
  }
  if(query.Class!=""){
    searchData.Class=query.Class
  }
  if(query.Mobile!=""){
    searchData.Mobile=query.Mobile
  }
  if(query.BloodGroup!=""){
    searchData.BloodGroup=query.BloodGroup
  }
  studentHelper.getStudents(searchData).then(async(students)=>{
    res.render("admin/search-result",{students})

 })
 

})

router.get('/add-student',(req,res)=>{
  res.render('admin/add-student')
})

router.post('/add-student',(req,res)=>{

  studentHelper.addStudent(req.body,(id)=>{
    let image = req.files.StudentImage
    image.mv('./public/images/students-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.redirect("/admin/add-student")
      } else {
        console.log(err)
      }
    })
   
  })

})

router.get('/edit-student',async(req,res)=>{
  let studentId = req.query.id
  let student=await studentHelper.getStudentDetails(studentId)
  res.render('admin/edit-student',{student})

})

router.post('/edit-student/',(req,res)=>{
  console.log(req.body)
  studentHelper.updateStudent(req.query.id,req.body).then(()=>{
    res.redirect('/admin/search-student')
    if(req.files.Image){
    let image = req.files.Image
    image.mv('./public/images/students-images/'+req.query.id+'.jpg')
    
  }
  })
})

router.get('/delete-student/',(req,res)=>{
  let studentId = req.query.id
  
  studentHelper.deleteStudent(studentId).then((response)=>{
    studentHelper.deleteMarks(studentId)
    fs.unlink('./public/images/students-images/'+req.query.id+'.jpg',()=>{})
    res.redirect('/admin/search-student')
  })


})



router.get('/add-marks/',(req,res)=>{
  let studentId=req.query.id
  
  res.render('admin/add-marks',{studentId})
})

router.post('/add-marks/',(req,res)=>{
  let studentId = req.query.id
  let marks = req.body;
  
  studentHelper.addMarks(marks,studentId).then((data)=>{
    res.redirect('/admin/search-student')
  })

})


router.get('/view-student/',async(req,res)=>{
  let studentId = req.query.id
  let student=await studentHelper.getStudentDetails(studentId)

  let marks=await studentHelper.getMarks(studentId)
  res.render('admin/view-student',{student,marks})
})

router.get('/view-marks/',async(req,res)=>{

  let studentId= req.query.id;
  let marks=await studentHelper.getMarks(studentId)
    
    res.json(marks)
  

})


router.post('/edit-marks/',async(req,res)=>{
  let marks = req.body;
  let studentId = req.body.studentId
  let subject = req.body.Subject
  console.log(marks)
  if(Array.isArray(subject) ){
    let arrayofMarks=[]
    for (i = 0; i <subject.length; i++) {
  
      let sub = marks.Subject[i]
      let mark = marks.Mark[i]
      let object= {
        Semester:marks.Semester,
        Subject:sub,
        Mark:mark
  
      }
  
      arrayofMarks.push(object)
      
    }
     studentHelper.editMarks(studentId,arrayofMarks)
     res.json({status:true})
    
  
  } else{

   studentHelper.editMarks(studentId,marks)
   res.json({status:true})
  
  }
  

  // console.log(array)

})



module.exports = router;
