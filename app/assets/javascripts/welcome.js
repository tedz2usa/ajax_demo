var todoList, newTodoInput, newTodoCreate, requestLogOutput;

window.onload = function() {

	/*  Setup Ajax Request Logging.  */

	// Get the request log div and view Ajax calls checkbox.
	requestLogOutput = document.getElementById("requestLogOutput");
	toggleAjaxView = document.getElementById("toggleAjaxView");
	toggleAjaxView.checked = false;

	// Set the button click listener for view Ajax calls checkbox.
	toggleAjaxView.onclick = function() {
		requestLogOutput.style.display = this.checked ? "inline-block" : "none";
	}


	/*  Setup the Todo List.  */

	// Get the todo list div.
	todoList = document.getElementById("todoItems");

	// Get new todo item input field and create button.
	newTodoInput  = document.getElementById("newTodoInput");
	newTodoCreate = document.getElementById("newTodoCreate");

	// Set button click listener to create button.
	newTodoCreate.onclick = createTodoItem;

	// Update the todo list display.
	updateTodoList();

}





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

	// Log this request.
	logRequest("POST", "/todo_items", JSON.stringify(payload));

}

function updateTodoList() {

	// Create a new XMLHttpRequest object.
	var request = new XMLHttpRequest();

	// Specify the HTTP method and url.
	request.open("GET", "/todo_items.json");

	// Asssign listener when done.
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			var todoItems = JSON.parse(request.responseText);
			updateTodoListDOM(todoItems);
		}
	}

	// Initiate the request.
	request.send();

	// Log this request.
	logRequest("GET", "/todo_items.json");

}

function updateTodoListDOM(todoItems) {

	// Clear the todoList DOM element, and new todo input field.
	todoList.innerHTML = "";
	newTodoInput.value = "";

	for (var i = 0; i < todoItems.length; i++) {

		// Extract the item data.
		var itemData = todoItems[i];

		// Create a Todo Item DOM element to add to document.
		var item = createTodoItemDOM(itemData);

		// Add the item DOM element to the todoList.
		todoList.appendChild(item);

	}

}

function createTodoItemDOM(todoItemData) {

	// Create the item DOM element.
	var item = document.createElement("div");
	item.className = "todoItem";
	item.dataset.todoItemId   = todoItemData.id;
	item.dataset.todoItemData = JSON.stringify(todoItemData);

	// Create the todo item checkbox.
	var checkbox = document.createElement("input");
	checkbox.type    = "checkbox";
	checkbox.checked = todoItemData.completed;

	// Create the todo item label.
	var label = document.createElement("p");
	label.className = "label";
	label.innerHTML = todoItemData.label;

	// Add a strikethrough class if the todo item is completed.
	if (todoItemData.completed) {
		label.className += " strikethrough";
	}

	// Create the remove button.
	var remove = document.createElement("span");
	remove.className = "remove";
	remove.innerHTML = "(remove)";

	// Add event listeners to checkbox, label, and remove.
	checkbox.onclick = checkboxClickListener;
	label.onclick    = labelClickListener;
	remove.onclick   = removeClickListener;
	
	// Add the checkbox and label to the item DOM element.
	item.appendChild(checkbox);
	item.appendChild(label);
	item.appendChild(remove);

	return item;

}

function checkboxClickListener() {

	// Get the todo item ID.
	var item = this.parentNode;
	var id   = item.dataset.todoItemId;

	// Generate an ojbect of attribute changes.
	var changeObject = {
		completed: this.checked
	}

	// Update the database and display.
	updateTodoItem(id, changeObject);

}

function labelClickListener() {

	// Get the parent, item DOM node.
	var item = this.parentNode;

	// Find the remove link, and remove it.
	var remove = item.querySelector(".remove");
	item.removeChild(remove);

	// Create the edit div.
	var edit = document.createElement("div");
	edit.className = "edit";

	// Create the input field.
	var inputField   = document.createElement("input");
	inputField.type  = "text";
	inputField.value = this.innerHTML;

	// Create the save button.
	var saveButton = document.createElement("button");
	saveButton.innerHTML = "Save";
	saveButton.onclick   = saveClickListener;

	// Create the cancel button.
	var cancelButton = document.createElement("button");
	cancelButton.innerHTML = "Cancel";
	cancelButton.onclick   = cancelClickListener;

	// Add the input field, save button, and cancel button to the edit div.
	edit.appendChild(inputField);
	edit.appendChild(saveButton);
	edit.appendChild(cancelButton);

	// Swap the label div tag (this) with an edit div tag.
	item.replaceChild(edit, this);

}

function removeClickListener() {

	// Get the parent, item DOM node.
	var item = this.parentNode;

	// Get the todo item ID.
	var id   = item.dataset.todoItemId;

	// Destroy the todo item.
	destryTodoItem(id);

}

function saveClickListener() {

	// Get the parent, edit div tag.
	var edit = this.parentNode;

	// Get the todo item ID.
	var item = edit.parentNode;
	var id   = item.dataset.todoItemId;

	// Get the input tag.
	var inputField = edit.querySelector("input");

	// Generate an ojbect of attribute changes.
	var changeObject = {
		label: inputField.value
	}

	// Update the database and display.
	updateTodoItem(id, changeObject);

}

function cancelClickListener() {

	// Get the parent, edit div tag.
	var edit = this.parentNode;

	// Get the current todo item DOM node and original data.
	var currentItem = edit.parentNode;
	var currentData = JSON.parse(currentItem.dataset.todoItemData);

	// Create a new item DOM node based on original data.
	var newItem = createTodoItemDOM(currentData);

	// Swap out the current item DOM node with the new item DOM node.
	todoList.replaceChild(newItem, currentItem);

}

function updateTodoItem(id, changeObject) {

	// Create a new XMLHttpRequest object.
	var request = new XMLHttpRequest();

	// Specify the HTTP method and url.
	request.open("PUT", "/todo_items/" + id + ".json");

	// Asssign listener when done.
	request.onreadystatechange = function() {
		if (request.readyState === 4) {

			// Get the current DOM node of item.
			var currentItem = todoList.querySelector("div[data-todo-item-id='" + id + "']");

			// Create a new DOM node of item.
			var itemData = JSON.parse(request.responseText);
			var newItem  = createTodoItemDOM(itemData);

			// Swap the current item DOM node with the new item DOM node.
			todoList.replaceChild(newItem, currentItem);

		}
	}

	// Make the data payload.
	var payload = {
		todo_item: changeObject
	}

	// Initiate the request, sending the payload.
	request.setRequestHeader("Content-Type","application/json")
	request.send(JSON.stringify(payload));

	// Log this request.
	logRequest("PUT", "/todo_items/" + id + ".json", JSON.stringify(payload));

}

function destryTodoItem(id) {

	// Create a new XMLHttpRequest object.
	var request = new XMLHttpRequest();

	// Specify the HTTP method and url.
	request.open("DELETE", "/todo_items/" + id + ".json");

	// Asssign listener when done.
	request.onreadystatechange = function() {
		if (request.readyState === 4) {

			// Get the current DOM node of item.
			var currentItem = todoList.querySelector("div[data-todo-item-id='" + id + "']");

			// Remove the current item DOM node.
			todoList.removeChild(currentItem);

		}
	}

	// Initiate the request.
	request.responseType = "text";
	request.send();

	// Log this request.
	logRequest("DELETE", "/todo_items/" + id + ".json");

}

function logRequest(httpMethod, url, body) {

	// Create a new request logging.
	var log = document.createElement("div");
	log.className = "log";

	// Create the log text (html).
	logText =  "<p><span class='logHead'>Sending a request...</span></p>"
	logText += "<p><span class='logLabel'>METHOD: </span> <span class='logValue logMethod'>" + httpMethod + "</span></p>";
	logText += "<p><span class='logLabel'>URL:    </span> <span class='logValue'>" + url + "</span></p>";
	logText += "<p><span class='logLabel'>DATA:   </span> <span class='logValue'>" + (body ? body : "(None)") + "</span></p>";

	log.innerHTML = logText;

	// Append the log to the request log output.
	requestLogOutput.appendChild(log);

}
