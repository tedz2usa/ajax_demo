window.onload = function() {

	// Get new todo item input field and create button.
	var newTodoInput  = document.getElementById("newTodoInput");
	var newTodoCreate = document.getElementById("newTodoCreate");

	// Set button click listener to create button.
	newTodoCreate.onclick = createTodoItem;

	updateTodoList();

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


		// Initiate the request, sending the payload.
		request.setRequestHeader("Content-Type","application/json")
		request.send(JSON.stringify(payload));

	}

	function updateTodoList() {

		// Create a new XMLHttpRequest object.
		var request = new XMLHttpRequest();

		// Specify the HTTP method and url.
		request.open("GET", "/todo_items.json");

		// Asssign listener when done.
		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				var itemsList = document.getElementById("todoItems");
				var todoItems = JSON.parse(request.responseText);
				console.log(todoItems);
				updateTodoListDOM(request.responseText);
			}
		}

		// Initiate the request, sending the payload.
		request.setRequestHeader("Content-Type","application/json")
		request.send();

	}

	function updateTodoListDOM(todoItems) {

		var str = "";

		for (var i = 0; i < todoItems.length; i++) {



		}

	}

}