$(document).ready(function(){ // Document open

    $("#book_insert_frm_reset").on("click",function()       // reset book registration form
    {  
        $("#book_insert_frm").trigger("reset");
    });

    $("#new_book_reg").on("click",function()                // new book registration
    {
        var book_name   = $("#insert_book_name").val();     // book name taken 
        var author_name = $("#insert_author_name").val();   // author name taken 
        var book_number = $("#insert_book_number").val();   // book number taken 
        var book_price  = $("#insert_book_price").val();    // book price taken 
        var book_stock  = $("#insert_book_stock").val();    // book stock taken 

        if(book_name == "")
        {
            Swal.fire({
                icon: 'warning',
                title: 'Fill Blanks',
                html: '<span style="color:red;">Enter book name!</span>'
              })
        }
        else if(author_name == "")
        {
            Swal.fire({
                icon: 'warning',
                title: 'Fill Blanks',
                html: '<span style="color:red;">Enter author name!</span>'
              })
        }
        else if(book_number == "")
        {
            Swal.fire({
                icon: 'warning',
                title: 'Fill Blanks',
                html: '<span style="color:red;">Enter book number!</span>'
              })
        }
        else if(book_price == "")
        {
            Swal.fire({
                icon: 'warning',
                title: 'Fill Blanks',
                html: '<span style="color:red;">Enter book price!</span>'
              })
        }
        else if(book_stock <= 0)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Fill Blanks',
                html: '<span style="color:red;">Enter valid book stock!</span>'
              })
        }
        else
        {

            $.ajax({
                type: "POST",
                url: "/new_book_registration",
                data: {
                    book_name   : book_name,
                    author_name : author_name,
                    book_number : book_number,
                    book_price  : book_price,
                    book_stock  : book_stock
                },
                success: function(book_reg_response) {
                    if(book_reg_response == 1)
                    {
                        $("#book_insert_frm").trigger("reset");
                        Swal.fire({
                            title: "Please wait...!", //Text can be changed example Success!
                            html: "Saving <strong></strong> Information.<br/><br/>",//Text can be changed
                            type: "success", //Text can be changed example success, warning, danger
                            timer: 2000, //Set the time interval (in milliseconds).
                            timerProgressBar: true,
                            didOpen: () => {
                                const content = Swal.getHtmlContainer()
                                const $ = content.querySelector.bind(content)
                                Swal.showLoading()
                                timerInterval = setInterval(() => {
                                    Swal.getHtmlContainer().querySelector('strong')
                                        .textContent = ('')
                                        .toFixed(0)
                                }, 100)
                            },
                            willClose: () => {
                                clearInterval(timerInterval)
                            },
                            showConfirmButton: false, //Turn off confirmation button, if true, it will show ok button, click again.
                        }).then(function() {
                            load_book();
                        });
                        
                          $("#add_book_modal").css("display","none");
                          
                    }
                    else
                    {
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed!',
                            html: book_reg_response
                          })
                    }
                    
                }
            });
        }

    });



load_book();
  function load_book(query)
  {
    if (query === undefined) {
        query = '';
      }
   $.ajax({
    url:"/booksearch",
    method:"POST",
    data: {
        query:query
    },
    success:function(data)
    {
      $('#fetch_book_table').html(data);
      $("#fetch_book_table").append(data.htmlresponse);
    }
   });
  }
  $('#search_book').on("keyup",function(){
    var search = $(this).val();
    if(search != ''){
    load_book(search);
   }else{
    load_book();
   }
  });


//############ Book section close / && student section open ####################################################//
  load_student();
  function load_student(query)
  {
    if (query === undefined) {
        query = '';
      }
   $.ajax({
    url:"/student_search",
    method:"POST",
    data: {
        query:query
    },
    success:function(data)
    {
      $('#fetch_student_table').html(data);
      $("#fetch_student_table").append(data.htmlresponse);
    }
   });
  }
  $('#search_student').on("keyup",function(){
    var search = $(this).val();
    if(search != ''){
    load_student(search);
   }else{
    load_student();
   }
  });

  $("#pin_generate_btn").on("click",function(){
    let x = Math.floor((Math.random() * 99999) + 99999);
    $("#insert_student_password").val('DG@'+x);
  });

  $("#student_insert_frm_reset").on("click",function(){
    $("#student_insert_frm").trigger("reset");
  });

  $("#new_student_reg").on("click",function(){
    var student_name        = $("#insert_student_name").val();
    var student_email       = $("#insert_student_email").val();
    var student_password    = $("#insert_student_password").val();
    var student_contact     = $("#insert_student_contact").val();
    var student_address     = $("#insert_student_address").val();
    
    if(student_name == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Fill Blanks',
            html: '<span style="color:red;">Enter student name!</span>'
          })
    }
    else if(student_email == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Fill Blanks',
            html: '<span style="color:red;">Enter student email!</span>'
          })
    }
    else if(student_password == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Fill Blanks',
            html: '<span style="color:red;">Enter security key!</span>'
          })
    }
    else if(student_contact == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Fill Blanks',
            html: '<span style="color:red;">Enter phone number!</span>'
          })
    }
    else if(student_address == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Fill Blanks',
            html: '<span style="color:red;">Enter student address!</span>'
          })
    }
    else
    {
        $.ajax({
            type: "POST",
            url: "/new_student_registration",
            data: {
                student_name        : student_name,
                student_email       : student_email,
                student_password    : student_password,
                student_contact     : student_contact,
                student_address     : student_address
            },
            success: function(student_reg_response) {
                if(student_reg_response == 1)
                {
                    $("#student_insert_frm").trigger("reset");
                    Swal.fire({
                        title: "Please wait...!", //Text can be changed example Success!
                        html: "Saving <strong></strong> Information.<br/><br/>",//Text can be changed
                        type: "success", //Text can be changed example success, warning, danger
                        timer: 2000, //Set the time interval (in milliseconds).
                        timerProgressBar: true,
                        didOpen: () => {
                            const content = Swal.getHtmlContainer()
                            const $ = content.querySelector.bind(content)
                            Swal.showLoading()
                            timerInterval = setInterval(() => {
                                Swal.getHtmlContainer().querySelector('strong')
                                    .textContent = ('')
                                    .toFixed(0)
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        },
                        showConfirmButton: false, //Turn off confirmation button, if true, it will show ok button, click again.
                    }).then(function() {
                        load_student();
                    });
                    
                      $("#add_student_modal").css("display","none");
                      
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed!',
                        html: '<span style="color:red;">Registration failed</span>'
                      })
                }
                
            }
        });
    }

  });

//############ student section close / && book issue section open ####################################################//

load_issued_book();
function load_issued_book(query)
{
  if (query === undefined) {
      query = '';
    }
 $.ajax({
  url:"/issued_book_search",
  method:"POST",
  data: {
      query:query
  },
  success:function(data)
  {
    $('#fetch_issue_book_table').html(data);
    $("#fetch_issue_book_table").append(data.htmlresponse);
  }
 });
}
$('#search_issue_book').on("keyup",function(){
  var search = $(this).val();
  if(search != ''){
  load_issued_book(search);
 }else{
  load_issued_book();
 }
});

  $("#issue_book_id").on("keyup",function()
  {
    var book_id = $("#issue_book_id").val();
    console.log(book_id);
      $.ajax({
              type: "POST",
              url: "/get_book_by_id",
              data: {
                book_id : book_id
              },
              success: function(book_fetch_response) 
              {
                  $('#get_book_details').html(book_fetch_response);
                  $("#get_book_details").append(book_fetch_response.htmlresponse);
              }
            });
  });

  $("#book_issue_frm_reset").on("click", function(){
    $("#book_issue_insert_frm").trigger("reset");
    $("#issue_book_number").val("");
    $("#issue_book_price").val(0);
    $("#issue_book_stock").val(0)
  });

$("#new_book_issue_reg").on("click", function(){
    var student_id  = $("#issue_student_id").val();
    var book_id     = $("#issue_book_id").val();
    var book_number = $("#issue_book_number").val();
    var book_price  = $("#issue_book_price").val();
    var return_date = $("#issue_return_date").val();
    var book_stock  = parseInt($("#issue_book_stock").val());
    var stock_left  = (book_stock - 1);

    if(student_id == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Fill Blanks',
            html: '<span style="color:red;">Enter student id!</span>'
          })
    }
    else if(book_id == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Fill Blanks',
            html: '<span style="color:red;">Enter book id!</span>'
          })
    }
    else if(book_stock <= 0)
    {
        Swal.fire({
            icon: 'info',
            title: 'Unavailable!',
            html: '<span style="color:red;">Stock not available!</span>'
          })
    }
    else if(book_number == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Entry',
            html: '<span style="color:red;">Enter valid book id!</span>'
          })
    }
    else if(return_date == "")
    {
        Swal.fire({
            icon: 'warning',
            title: 'Fill Blanks',
            html: '<span style="color:red;">Select return date!</span>'
          })
    }
    else
    {
        console.log(stock_left);
        $.ajax({
            type: "POST",
            url: "/book_issue_registration",
            data: {
                student_id  : student_id,
                book_id     : book_id,
                book_number : book_number,
                book_price  : book_price,
                return_date : return_date,
                stock_left  : stock_left
            },
            success: function(book_issue_reg_response) {
                if(book_issue_reg_response == 1)
                {
                    $("#book_issue_insert_frm").trigger("reset");
                    $("#issue_book_number").val("");
                    $("#issue_book_price").val(0);
                    $("#issue_return_date").val("");
                    $("#issue_book_stock").val(0);
                    Swal.fire({
                        title: "Please wait...!", //Text can be changed example Success!
                        html: "Operation <strong></strong> in progress.<br/><br/>",//Text can be changed
                        type: "success", //Text can be changed example success, warning, danger
                        timer: 2000, //Set the time interval (in milliseconds).
                        timerProgressBar: true,
                        didOpen: () => {
                            const content = Swal.getHtmlContainer()
                            const $ = content.querySelector.bind(content)
                            Swal.showLoading()
                            timerInterval = setInterval(() => {
                                Swal.getHtmlContainer().querySelector('strong')
                                    .textContent = ('')
                                    .toFixed(0)
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        },
                        showConfirmButton: false, //Turn off confirmation button, if true, it will show ok button, click again.
                    }).then(function() {
                        load_issued_book();
                    });
                    
                      $("#book_issue_modal").css("display","none");
                      
                }
                else
                {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed!',
                        html: '<span style="color:red;">Operation failed</span>'
                      })
                }
                
            }
        });
    }

});

//############ book issue section close / && return book section open ####################################################//
load_return_book();
function load_return_book(query)
{
  if (query === undefined) {
      query = '';
    }
 $.ajax({
  url:"/return_book_search",
  method:"POST",
  data: {
      query:query
  },
  success:function(data)
  {
    $('#fetch_return_book_table').html(data);
    $("#fetch_return_book_table").append(data.htmlresponse);
  }
 });
}
$('#search_return_book').on("keyup",function(){
  var search = $(this).val();
  if(search != ''){
    load_return_book(search);
 }else{
    load_return_book();
 }
});



$("#display_cam").on("click", function(){
  $("#signal_lost").css("display","none");
  $(".no_signal").removeClass("w3-padding-16");
  $("#camera_output").css("display","block");

  var front = false;
  var video = document.querySelector('video');   
  document.getElementById('flipCamera').onclick = function() { front = !front; };
  var constraints = { video: { facingMode: (front? "user" : "environment"), width: 1000, height: 480  } };
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(mediaStream) {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
    video.play();
};
})

.catch(function(err) { console.log(err.name + ": " + err.message); })

function vidOff() {
  if(video.paused)
  {
    video.play();
  }
  else
  {
    video.pause();
  }
  
}

$("#hide_cam").on("click",function(){
  vidOff();
})
});

//################### camera clone here ########
$("#camera_output").on("click", function(){
  if( $("#expand_camera").css("display") == "none" )
  {
    $("#contain_img").css("display","none");
    $("#expand_camera").css("display","block");
    var front = false;
    //var video = document.querySelector('video');   
    var video = document.getElementById('expand_camera');
    document.getElementById('flipCamera').onclick = function() { front = !front; };
    var constraints = { video: { facingMode: (front? "user" : "environment"), width: 1280, height: 480  } };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
      video.play();
  };
  })
  
  .catch(function(err) { console.log(err.name + ": " + err.message); })
  
  function vidOff() {
    if(video.paused)
    {
      video.play();
    }
    else
    {
      video.pause();
    }
    
  }
  
  $("#hide_cam").on("click",function(){
    vidOff();
  })
  }
  else
  {
    $("#contain_img").css("display","block");
    $("#expand_camera").css("display","none");
    function vidOff() {
      if(video.paused)
      {
        video.play();
      }
      else
      {
        video.pause();
      }
      
    }
    vidOff();
  }

});


//################### Show date code #####################################################
// get a new date (locale machine date time)
var get_date = new Date();
// get the date as a string
var show_date = get_date.toDateString();
document.getElementById("show_live_date").innerHTML= show_date; // show live date
}); // Document close