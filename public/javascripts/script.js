$('#bt-update').hide()
 function addFields() {
        // Number of inputs to create
        var index = document.getElementById('container').children.length+1
 
            var clone = $("#inputfield-1").clone();
            clone.attr('id',"inputfield-"+index)

            clone.find("#inp-1").attr("id","inp-"+index);
            clone.find("#1").attr("id",index);

            //append clone on the end
            $("#container").append(clone); 
    
            
        }
    
    function removeFields() {
        var element = document.getElementById('container');
        var el =element.lastChild.id;
            if(el!='inputfield-1'){
                element.removeChild(element.lastChild);
            }
    }
    

    function selectSubject(id){
        var subject = document.getElementById(id).value;
        document.getElementById("inp-"+id).setAttribute('placeholder',subject)
        
        
    }
    
    function viewImage(event) {
        document.getElementById('imageview').src = URL.createObjectURL(event.target.files[0])
    }

    

    // function change(studentId){
    //     $("#markeditContainer").empty();
    //     let semester = document.getElementById("semester").value
    //     $.ajax({
    //         url:'/admin/view-marks?id='+studentId,
    //         method:'get',
    //         success:(data)=>{
    //             alert("ffff")
    //             for(var i in data){
    //                 var row = data[i];
    //                 var sem = row.Semester;
    //                 var sub = row.Subject;            
    //                 var mark = row.Marks;
    //                 mark
    //                 if(sem==semester){
    //                     alert(sub+mark)
    //                     $('#bt-update').show() 
    //                     // append("<div class='form-group col-lg-4 mt-1'><input readonly='true' name='Subject' class='form-control' value='"+sub+"'/></div><div class='col-lg-8 mt-1'><input onchange='inpchange()' name='Mark' class='form-control' value='"+mark+"'/></div></div>"); 
    //                     // $('#markviewContainer').
    //                 $('#markeditContainer').append("<tr><td>"+sub+"</td><td>"+mark+"</td></tr>"); 
    //             } 
    //             }
    //         }        
    //     })
    // }

    function change1(studentId){
        $("#markeditContainer").empty();
        let semester = document.getElementById("semester").value
        $.ajax({
            url:'/admin/view-marks?id='+studentId,
            method:'get',
            success:(data)=>{
                
                for(var i in data){
                    var row = data[i]; 
                    var sem = row.Semester;
                    var sub = row.Subject;            
                    var mark = row.Marks;
                    mark
                    if(sem==semester){

                     $('#bt-update').show()
                    $('#markeditContainer').append("<div class='form-group col-lg-4 mt-1'><input readonly='true' name='Subject' class='form-control' value='"+sub+"'/></div><div class='col-lg-8 mt-1'><input onchange='inpchange()' name='Mark' class='form-control' value='"+mark+"'/></div></div>"); 
                } 
                }  
            }
        })
    }

    function change2(studentId){
        $("#markviewContainer").empty();
        let semester = document.getElementById("semester").value
        $.ajax({
            url:'/admin/view-marks?id='+studentId,
            method:'get',
            success:(data)=>{
                
                for(var i in data){
                    var row = data[i]; 
                    var sem = row.Semester;
                    var sub = row.Subject;            
                    var mark = row.Marks;
                    mark
                    if(sem==semester){
                        
                       
                    $('#markviewContainer').append("<tr><td>"+sub+"</td><td>"+mark+"</td></tr>"); 
                } 
                }  
            }
        })
    }


    function inpchange(){
        document.getElementById('bt-update').removeAttribute('disabled')
    }

    var spinner = $('#cover-spin');

    $("#mark-form").submit((e)=>{
        spinner.show();
        e.preventDefault()
        $.ajax({
            url:"/admin/edit-marks",
            data:$("#mark-form").serialize(),
            method:"post",
            success:function (response){
                spinner.hide();
                
                
            },
            error:function (err){
                alert("something went wrong")
            }
        })
    })
    

    
    

    
    
    
