var page_num = 1
var max_page = -1
var category_id = -1

function loadCategory(id) {
  category_id = id

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      result = JSON.parse(this.responseText);

      document.getElementById("category_title").innerHTML = result.subject;

      //<!-- TODO: change page limit to use .env -->
      max_page = Math.ceil(result.number_of_posts / 25)

      if (max_page == 1) {
      	document.getElementById("next_button").style.display = "none";
      }

      genratePagination()
 	  loadThreads(result.Threads);
    }
  };
  //<!-- TODO: change localhost to actual DB server -->
  xhttp.open("GET", "http://localhost:3000/api/v1/pages/subCategory/" + category_id +"/1" , false);
  xhttp.send();
}

function updateThreads() {
  var xhttp = new XMLHttpRequest();
  document.getElementById("threads").innerHTML = ""

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      result = JSON.parse(this.responseText);
      genratePagination()
 	  loadThreads(result.Threads);
    }
  };
  //<!-- TODO: change localhost to actual DB server -->
  xhttp.open("GET", "http://localhost:3000/api/v1/pages/subCategory/" + category_id + "/" + page_num, true);
  xhttp.send();
}

function incrementPage(val) {
  
	updatePage(page_num + val)
}

function decrementPage(val) {
  
	updatePage(page_num - val)
}

function updatePage(new_page) {
  page_num = new_page

  var next = document.getElementById("next_button");
  var prev = document.getElementById("prev_button");

  if (page_num == max_page) {
    next.style.display = "none";
  } else if (next.style.display = "none") {
    next.style.display = "initial";
  }

  if (page_num == 1) {
    prev.style.display = "none";
  } else if (prev.style.display = "none") {
    prev.style.display = "initial";
  }

  updateThreads()
}

function genratePagination() {
	  document.getElementById("threads").innerHTML = ""

	  let button_num = 0
      for (let i = page_num; i <= max_page; i++) {
      	if (button_num > 4) {
      		break
      	}
  		$('#pages').append(`<button onclick="updatePage(${i})" class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                                    ${i}
                                </button>`)
	  }
}
//TODO - change so thread links goto proper location
function loadThreads(threads) {
  $('#threads').append(
	      $.map(threads, function (thread) {
	      var date = new Date(thread.created);

          return `<table class="w-full shadow-lg rounded">
          <div
              class="px-4 py-2 border-b border-gray uppercase text-left bg-gray-300 text-gray-700 font-bold">
          </div>
          <tbody class="bg-white">
              <tr class="accordion border-b border-grey-light hover:bg-gray-100">
                  <td></td>
                   
                  <td class="flex inline-flex items-center">
                      <span>
                          <img class="hidden mr-1 md:mr-2 md:inline-block h-8 w-8 rounded-full object-cover"
                              src="https://cdn0.iconfinder.com/data/icons/user-63/512/399_Personal_Personalization_Profile_User-512.png"
                              alt="" />
                      </span>
                     
                      <span class="py-3 w-full pl-2">
                      
                          <a href="./threads/${thread.subject}/${thread.thread_id}/1" class="text-gray-800 text-sm">${thread.subject}</a>
                          <p class="md:hidden text-xs text-gray-600 font-medium">Anonymous#1</p>
                          <p class="hidden md:table-cell text-xs text-gray-500 font-medium">
                              Anonymous#1</p>
                          <p class="pl-1 hidden md:table-cell text-xs text-gray-500 font-medium">
                               ${thread.created}
                      </span>
                  </td>
                  <td class="hidden md:table-cell w-20">
                      <dt class="text-sm text-gray-500 text-center">Views</dt>
                      <dd class="text-sm text-gray-800 font-medium text-center">${thread.number_of_views}</dd>
                  </td>
                  <td class="hidden md:table-cell w-20">
                      <dt class="text-sm text-gray-500 text-center">Comments</dt>
                      <p class="text-sm text-gray-700 font-medium text-center">${thread.number_of_posts}</p>
                  </td>
                  <td class="hidden md:table-cell w-20">
                      <dt class="text-sm text-gray-500 text-center">Comments</dt>
                      <p class="text-sm text-gray-700 font-medium text-center">10</p>
                  </td>
                  <td></td>
              </tr>
          </tbody>
      </table>`
	}).join("\n"));
}