var page_num = 1
var max_page = -1
var thread_id = -1
var user_id = -1

function setUserId() {
	var idDiv = document.getElementById("user_id")
	if (idDiv) {
		user_id = idDiv.getAttribute("value")
	}
}

function loadThread(id) {
  thread_id = id
  setUserId()
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      result = JSON.parse(this.responseText);
	  if (result.delayed) {
		document.getElementById("thread_title").innerHTML = result.delayed
	  } else{
		document.getElementById("thread_title").innerHTML = result.subject
	  }
       	  
      <!-- TODO: change page limit to use .env -->
      max_page = Math.ceil(result.number_of_posts / 25)
      
      if (max_page == 1) {
      	document.getElementById("next_button").style.display = "none";
      }
      
      genratePagination()
 	  loadPosts(result.posts);
    }
  };
  <!-- TODO: change localhost to actual DB server -->
  xhttp.open("GET", "http://localhost:3000/api/v1/pages/Thread/" + thread_id + "/1", false);
  xhttp.send();
}

function updatePosts() {
  var xhttp = new XMLHttpRequest();
  document.getElementById("posts").innerHTML = ""
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      result = JSON.parse(this.responseText);
      
      max_page = Math.ceil(result.number_of_posts / 25)
      
      if (max_page > page_num) {
    	  document.getElementById("next_button").style.display = "initial";
      }
      
      genratePagination()
 	  loadPosts(result.posts);
    }
  };
  <!-- TODO: change localhost to actual DB server -->
  xhttp.open("GET", "http://localhost:3000/api/v1/pages/Thread/" + thread_id + "/" + page_num, true);
  xhttp.send();
}

function incrementPage(val) {
	updatePage(page_num + val)
}

function editthread() {
	var r = prompt("Enter new thread title");
	if(r){
		
		
		var subpage = window.location.pathname.split('/')[2]
		
	
    	$.ajax({type:"PUT", url: "http://localhost:3000/api/v1/pages/thread", data: "thread_id="+thread_id+"&subject="+r, success: window.location.href = "http://localhost:3000/p/"+subpage})
			
	}
}
function deletethread() {
	var r = confirm("Please confirm you want to delete your thread");
	if(r){
		var sub_cat_id = thread_id;
    	
		var subpage = window.location.pathname.split('/')[2]
	
    		$.ajax({type:"DELETE", url: "http://localhost:3000/api/v1/pages/thread", data: "thread_id="+thread_id, success: window.location.href = "http://localhost:3000/p/"+subpage})
			
		
	}
	
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
  
  updatePosts()
}

function genratePagination() {
	  document.getElementById("pages").innerHTML = ""
	  
	  let button_num = 0
      for (let i = page_num; i <= max_page; i++) {
      	if (button_num > 4) {
      		break
      	}
  		$('#pages').append(`<button onclick="updatePage(${i})" class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                                    ${i}
                                </button>`)
	  }

	  $("#edit").remove();
	  //implement hiding delete button if user is not OP
	  if (1){
		  $('#top').prepend(`<button onclick="editthread()" id="edit" class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l float:left">
		  EDIT
	  </button>`)
	  }
	  $("#delete").remove();
	  //implement hiding delete button if user is not OP
	  if (1){
		  $('#top').prepend(`<button onclick="deletethread()" id="delete" class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l float:left">
		  DELETE
	  </button>`)
	  }
}

function createPostHTML(post) {
    var date = new Date(post.created);
    
    var content = post.delayed ? post.delayed : post.content;
    var username = post.username ? post.username : "Anonymous"
    	
	var html = `<table class="w-full shadow-lg rounded">
		      	<tbody class="bg-white">
		  		<tr class="accordion border-b border-grey-light hover:bg-gray-100">
		  			<td></td>
		  			<!-- TODO: Update username and picture when feature is added -->
		  			<td class="items-center px-12">
		  				<span class="w-full">
		  					<img class="hidden mr-1 md:mr-2 md:inline-block h-16 w-16 rounded-full object-cover "
		                    src="https://cdn0.iconfinder.com/data/icons/user-63/512/399_Personal_Personalization_Profile_User-512.png" alt="" />
		                </span>
		                <span class="w-full">
		                	<p class="md:hidden text-xs text-gray-600 font-medium">${username}</p>
							<p class="hidden md:table-cell text-xs text-gray-500 font-medium"> ${username}</p>
		                    <br>
						</span>
					</td>
					<td id=${post.post_id} class="hidden md:table-cell w-full p-4">
						<p>${content}</p>
		            </td>
		            <td></td>
		        </tr>
		    </tbody>
		   </table>
		   <div class="w-full shadow-lg bg-white text-right border-b-2">`
		
		if (user_id == post.user_account_id) {
			html += `<button onclick="editPost(${post.post_id})" style="float: left; margin: 5px;">Edit</button>
				   	<button onclick="deletePost(${post.post_id})" style="float: left; margin: 5px;">Delete</button>`
		}
		
		html += `<p class="pl-1 text-xs text-gray-500 font-medium p-2">Posted on: ${date.toDateString()} ${date.toLocaleTimeString()}</p>
				 </div>`
			
	return html
}

function deletePost(post_id) {
	var post = {
			post_id: post_id,
		    thread_id: thread_id
		};
		
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
		    	updatePosts();
		    }
		  };
		<!-- TODO: change localhost to actual DB server -->
		xhttp.open("DELETE", "http://localhost:3000/api/v1/pages/post", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(JSON.stringify(post));
}

function editPost(post_id) {
	var post_field = document.getElementById(post_id)
	var original_content = post_field.getElementsByTagName('p')[0].innerHTML
	
	post_field.innerHTML = `<form>
                            <div class="container w-full shadow-lg bg-white mt-3 p-4">
                                <textarea id="${post_id}_content" class="form-textarea focus:bg-white focus:outline-none focus:shadow-outline border border-gray-300 py-2 px-4 block w-full appearance-none leading-normal" rows="7" type="text" >${original_content}</textarea>
                                <div class="text-right pt-2">
                                    <button onclick="updatePost(${post_id})" class="h-10 col-start-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" type="button">
                                        Update
                                    </button>
                                    <button onclick="restoreParagraph(${post_id}, '${original_content}')" class="h-10 col-start-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" type="button">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>`
	
}

function updatePost(post_id) {
	var new_content = document.getElementById(post_id + "_content").value
	
	var new_post = {
		content: new_content,
	    thread_id: thread_id,
	    post_id: post_id
	};
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
	    	restoreParagraph(post_id, new_content);
	    }
	  };
	<!-- TODO: change localhost to actual DB server -->
	xhttp.open("PUT", "http://localhost:3000/api/v1/pages/post", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(new_post));
}

function restoreParagraph(post_id, content) {
	var post_field = document.getElementById(post_id)
	
	post_field.innerHTML = `<p>${content}</p>`
}

function loadPosts(posts) {
  $('#posts').append(
	      $.map(posts, function (post) {
			var date = new Date(post.created);
			if (post.delayed){
				post.content = post.delayed;
				// Need to update date
				
			}
	
	      
	      return `<table class="w-full shadow-lg rounded">
			      	<tbody class="bg-white">
			      		<tr class="accordion border-b border-grey-light hover:bg-gray-100">
			      			<td></td>
			      			<!-- TODO: Update username and picture when feature is added -->
			      			<td class="items-center px-12">
			      				<span class="w-full">
			      					<img class="hidden mr-1 md:mr-2 md:inline-block h-16 w-16 rounded-full object-cover "
			                        src="https://cdn0.iconfinder.com/data/icons/user-63/512/399_Personal_Personalization_Profile_User-512.png" alt="" />
			                    </span>
			                    <span class="w-full">
			                    	<p class="md:hidden text-xs text-gray-600 font-medium">${post.username}</p>
									<p class="hidden md:table-cell text-xs text-gray-500 font-medium"> ${post.username}</p>
			                        <br>
								</span>
							</td>
							<td class="hidden md:table-cell w-full p-4">
								<p>${post.content}</p>
			                </td>
			                <td></td>
			            </tr>
			        </tbody>
			       </table>
			       <div class="w-full shadow-lg bg-white text-right border-b-2">
			       	<p class="pl-1 text-xs text-gray-500 font-medium p-2">Posted on: ${date.toDateString()} ${date.toLocaleTimeString()}</p>
			       </div>`
	}).join("\n"));
}

function uploadPost() {
	var textField = document.getElementById("content")
	var post = {
		content: textField.value,
	    thread_id: thread_id
	};
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
	    	textField.value = "";
	    		
	    	updatePosts();
	    }
	  };
	<!-- TODO: change localhost to actual DB server -->
	xhttp.open("POST", "http://localhost:3000/api/v1/pages/post", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(post));
}
