function asdf(page_name){
    console.log(document.getElementById('subject').value)
    console.log(document.getElementById('category').value)
    console.log(document.getElementById('content').value)

    var sub_cat_id = 1;
    var subject = document.getElementById('subject').value;
    var content = document.getElementById('content').value;

    console.log({sub_cat_id,subject,content })

    	
    $.post( "http://localhost:3000/api/v1/pages/thread", {sub_cat_id,subject,content } );

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://localhost:3000/api/v1/pages/Page/" + page_name, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText)
    //return xmlHttp.responseText;

    


}

function getCats(page_name){
    /*
    console.log(page_name)
    var info = $.get( "http://localhost:3000/api/v1/pages/Page/Jason");
    var info = $.getJSON( "http://localhost:3000/api/v1/pages/Page", page_name );
    console.log(info)
    */


   var xmlHttp = new XMLHttpRequest();
   xmlHttp.open( "GET", "http://localhost:3000/api/v1/pages/Page/Jason", false ); // false for synchronous request
   xmlHttp.send( null );
   console.log(xmlHttp.responseText)

   var res = JSON.parse(xmlHttp.responseText);
   console.log(res.sub_category[0])
   console.log(res.sub_category[0].length)

   var i;
   for(i =0; i < res.sub_category.length ; i++){
       var j;
       for(j = 0; j < res.sub_category[i].length ; j++){
            console.log(res.category[i].subject + "/" + res.sub_category[i][j].subject)

       }

   }





   //return xmlHttp.responseText;
}