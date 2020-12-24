var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectID 
const { response } = require('express')
module.exports={


    
    addStudent:(student, callback)=>{
        db.get().collection(collection.STUDENTS_COLLECTIONS).insertOne(student).then((data)=>{
            callback(data.ops[0]._id)
            
        })
    },

    getStudents:(query)=>{
         return new Promise (async(resolve,reject)=>{
             let students = await db.get().collection(collection.STUDENTS_COLLECTIONS).find(query).toArray()
             
             resolve(students)
         })
        
    },

    deleteStudent:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.STUDENTS_COLLECTIONS).removeOne({_id:objectId(studentId)}).then((response)=>{
                resolve(response)
            }) 
        })
    },

    getStudentDetails:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.STUDENTS_COLLECTIONS).findOne({_id:objectId(studentId)}).then((student)=>{
                resolve(student)
            })
        })
    },

    updateStudent:(studentId,studentDetails)=>{
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.STUDENTS_COLLECTIONS).updateOne({_id:objectId(studentId)},{

                $set:{
                    AdmissionNo:studentDetails.AdmissionNo,
                    Name:studentDetails.Name,
                    Dob:studentDetails.Dob,
                    Address:studentDetails.Address,
                    Mobile:studentDetails.Mobile,
                    Email:studentDetails.Email,
                    BloodGroup:studentDetails.BloodGroup,
                    State:studentDetails.State,
                    Country:studentDetails.Country,
                    Pincode:studentDetails.Pincode,
                    Class:studentDetails.Class,
                    Gname:studentDetails.Gname,
                    Goccupation:studentDetails.Goccupation,
                    Gmobile:studentDetails.Gmobile,
                    Gemail:studentDetails.Gemail

                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    
    addMarks:(marks,studentId)=>{
        
        let score=marks.Mark
        let marksObject={
            studentId:studentId,
            Marks:[marks]
        }
        return new Promise(async(resolve,reject)=>{
            
            let studentMark= await db.get().collection(collection.MARKS_COLLECTIONS).findOne({studentId:studentId})
            
            if(studentMark){
                let markExist=studentMark.Marks.filter(sub=> sub.Subject===marks.Subject && sub.Semester===marks.Semester)
                console.log("student Exist")
                let lt = markExist.length
                
                if(lt!=0){
                    console.log(lt)
                    db.get().collection(collection.MARKS_COLLECTIONS)
                    .updateOne({
                        studentId: studentId,
                        Marks: { $elemMatch: { Semester:marks.Semester, Subject:marks.Subject} }
                      },
                        {
                            $set:{'Marks.$.Mark':score}

                        }).then(()=>{
                            resolve()
                        })
                        
                        
                } 
                else{
                    console.log("not exist")
                    db.get().collection(collection.MARKS_COLLECTIONS).updateOne({studentId:studentId},{
                    
                        $push:{Marks:marks}
                          
                       }).then(()=>{
                           resolve()
                       })
                }
            } else{
                console.log("student not exist")
                db.get().collection(collection.MARKS_COLLECTIONS).insertOne(marksObject).then(()=>{
                    resolve()
                })
            }
        })
    },

    
    

    getMarks:(studentId)=>{
        return new Promise (async(resolve,reject)=>{
            let marks= await db.get().collection(collection.MARKS_COLLECTIONS).aggregate([
                {
                    $match:{studentId}
                },
                {
                    $unwind:'$Marks'
                
                },
                
                {
                    $project:{
                        Semester:'$Marks.Semester',
                        Subject:'$Marks.Subject',
                        Marks:'$Marks.Mark'

                    }
                }
               
            ]).toArray()
            
            resolve(marks)
            
        })
       
   },

   editMarks:(studentId,marks)=>{
        return new Promise (async(resolve,reject)=>{
            if(Array.isArray(marks)){
                console.log("not object")
                console.log(studentId)
                for (i = 0; i < marks.length; i++) {
                    await db.get().collection(collection.MARKS_COLLECTIONS).findOneAndUpdate(
                        { studentId : studentId},
                        { $set: { "Marks.$[elem].Mark" : marks[i].Mark } },
                        { arrayFilters: [ { "elem.Semester": marks[i].Semester,"elem.Subject": marks[i].Subject}] }
                    )
                }
            } else{
                console.log("object")
                await db.get().collection(collection.MARKS_COLLECTIONS).findOneAndUpdate(
                    { studentId : studentId},
                    { $set: { "Marks.$[elem].Mark" : marks.Mark } },
                    { arrayFilters: [{ "elem.Semester": marks.Semester,"elem.Subject": marks.Subject}] }
                )

            }
            
            
            
        })
       
   },

   
    

  
}
