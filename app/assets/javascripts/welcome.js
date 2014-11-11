window.onload = function() {

	// Get new todo item input field and create button.
	var newTodoInput  = document.getElementById("newTodoInput");
	var newTodoCreate = document.getElementById("newTodoCreate");

	// Set button click listener to create button.
	newTodoCreate.onclick = createTodoItem;


	function createTodoItem() {

		// Create a new XMLHttpRequest object.
		var request = new XMLHttpRequest();

		// Specify the HTTP method and url.
		request.open("POST", "/todo_items");

		// Asssign listener when done.
		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				updateTodoList();
			}
		}

		// Make the data payload.
		var payload = {
			todo_item: {
				label: newTodoInput.value,
				completed: false
			}
		}


		var data = new FormData();
		data.append("todo_item", payload);

		// Initiate the request, sending the payload.
		request.setRequestHeader("Content-Type","application/json")
		//request.send("label=" + newTodoInput.value + "&completed=false");
		request.send(JSON.stringify(payload));

	}

	function updateTodoList() {
		alert("updating...");
	}

}