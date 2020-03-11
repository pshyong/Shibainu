function asdf(){
    console.log(document.getElementById('subject').value)
    console.log(document.getElementById('category').value)
    console.log(document.getElementById('content').value)

    var sub_cat_id = 1;
    var subject = document.getElementById('subject').value;
    var content = document.getElementById('content').value;

    console.log({sub_cat_id,subject,content })

    	
    $.post( "http://localhost:3000/api/v1/pages/thread", {sub_cat_id,subject,content } );

}