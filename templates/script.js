$('#input').keyup(function(){
    var a = $(this).val();
    $('#result').text(a); 
});


function loadXMLDoc()
{
var xmlhttp;
xmlhttp=new XMLHttpRequest(); 
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.getElementById("result").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("POST","demo_post2.asp",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("fname=Henry&lname=Ford");
}
