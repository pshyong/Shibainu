function post_thread(page_name){


    var sub_cat_id = document.getElementById('category').value;
    var subject = document.getElementById('subject').value;
    var content = document.getElementById('content').value;

	
    $.post( "http://localhost:3000/api/v1/pages/thread", {sub_cat_id,subject,content } );
    window.location.href = "http://localhost:3000/p/"+page_name;

}

function getCats(page_name){


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result = JSON.parse(xhttp.responseText);
            var i;
            for(i =0; i < result.sub_category.length ; i++){
                var j;
                for(j = 0; j < result.sub_category[i].length ; j++){
                    console.log(result.category[i].subject + "/" + result.sub_category[i][j].subject)

                    var x = document.getElementById("category");
                    var c = document.createElement("option");
                    c.text = result.category[i].subject + "/" + result.sub_category[i][j].subject;
                    c.value = result.sub_category[i][j].sub_cat_id
                    x.options.add(c, 1);

                }

            }
            
            
        }
    };


    xhttp.open( "GET", "http://localhost:3000/api/v1/pages/Page/" + page_name, false ); 
    xhttp.send( null );

}