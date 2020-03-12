function asdf(page_name){


    var sub_cat_id = document.getElementById('category').value;
    var subject = document.getElementById('subject').value;
    var content = document.getElementById('content').value;

	
    $.post( "http://localhost:3000/api/v1/pages/thread", {sub_cat_id,subject,content } );
    window.location.href = "http://localhost:3000/p/"+page_name;

}

function getCats(page_name){

   var xmlHttp = new XMLHttpRequest();
   xmlHttp.open( "GET", "http://localhost:3000/api/v1/pages/Page/" + page_name, false ); 
   xmlHttp.send( null );

   var res = JSON.parse(xmlHttp.responseText);

   var i;
   for(i =0; i < res.sub_category.length ; i++){
       var j;
       for(j = 0; j < res.sub_category[i].length ; j++){
            console.log(res.category[i].subject + "/" + res.sub_category[i][j].subject)

            var x = document.getElementById("category");
            var c = document.createElement("option");
            c.text = res.category[i].subject + "/" + res.sub_category[i][j].subject;
            c.value = res.sub_category[i][j].sub_cat_id
            x.options.add(c, 1);

       }

   }

   //return xmlHttp.responseText;
}