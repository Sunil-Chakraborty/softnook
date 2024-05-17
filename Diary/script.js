// Wait for the DOM content to fully load
document.addEventListener("DOMContentLoaded", function() {
	
	// Get the back-to-login button element
    const backToLoginButton = document.getElementById("back-to-login-button");

    if (backToLoginButton) {
        // Add click event listener to the back-to-login button
        backToLoginButton.addEventListener("click", function() {
            // Redirect the user to the login page
            window.location.href = "login.html";
        });
    } else {
        console.error("Error: Back to Login Page button element not found.");
    }

	
     // Get form, expense list, and total amount elements
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    // Get the current date
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    // Set the default value for the date input
    const expenseDateInput = document.getElementById("expense-date");
    if (expenseDateInput) {
        expenseDateInput.value = formattedDate;
    } else {
        console.error("Error: Expense date input element not found.");
    }

    // Initialize expenses array from localStorage
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("loggedIn");
    const username = localStorage.getItem("username");

    

	// Array of valid username-password pairs
	const validCredentials = [
		{ username: "admin", password: "password" },
		{ username: "user1", password: "pass1" },
		{ username: "user2", password: "pass2" }
		// Add more username-password pairs as needed
	];


    // Function to handle form submission (login)
	function handleLogin(event) {
		event.preventDefault();

		const usernameInput = document.getElementById("username");
		const passwordInput = document.getElementById("password");

		// Check if elements exist before accessing their values
		if (usernameInput && passwordInput) {
			const inputUsername = usernameInput.value;
			const inputPassword = passwordInput.value;

			// Check if the input credentials match any valid pair
			const isValidCredentials = validCredentials.some(cred => {
				return cred.username === inputUsername && cred.password === inputPassword;
			});

			if (isValidCredentials) {
				// Authentication successful
				localStorage.setItem("loggedIn", "true");
				localStorage.setItem("username", inputUsername); // Store the username in localStorage
				alert("Login successful!"); // Display success message
				window.location.href = "linkadr.html"; // Redirect to main page
			} else {
				// Authentication failed
				alert("Invalid username or password. Please try again.");
			}
		} else {
			console.error("Error: Username or password input elements not found.");
		}
	}
	
    // Add event listener to the login form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }


    // Function to render expenses in tabular form    
    function renderExpenses() {
        // Clear expense list
        if (expenseList) {
            expenseList.innerHTML = "";

            // Loop through expenses array and create table rows
            expenses.forEach((expense, index) => {
                const formattedDate = new Date(expense.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                });

                // Create a new table row element
                const expenseRow = document.createElement("tr");

                // Add columns for each expense detail
                expenseRow.innerHTML = `
                    <td style="vertical-align: text-top;">${expense.name}</td>
                    <td style="vertical-align: text-top;text-align:left;width:100%;">${parseNarration(expense.comment)}</td>
                    <td style="vertical-align: text-top;">${formattedDate}</td>
                    <td style="vertical-align: text-top;">${expense.username}</td> <!-- Display expense's username from the expense object -->
                    <td style="vertical-align: text-top;">            
                        <i class="fas fa-edit edit-icon edit-btn" data-id="${index}"></i>&nbsp&nbsp&nbsp&nbsp
                        <i class="fas fa-trash-alt delete-icon delete-btn" data-id="${index}"></i>
                    </td>   
                `;

                // Append the row to the expense list
                expenseList.appendChild(expenseRow);
            });

            // Save expenses to localStorage
            localStorage.setItem("expenses", JSON.stringify(expenses));

            // Add event listeners to edit and delete buttons after rendering
            addEditEventListeners();
            addDeleteEventListeners(); // Call addDeleteEventListeners to attach event listeners to delete buttons
        } else {
            console.error("Error: Expense list element not found.");
        }
    }

    // Function to parse narration and replace URLs with masked anchor tags
    function parseNarration(narration) {
        // Regular expression to match URLs in text
        const urlRegex = /(?:^|\s)((?:https?|ftp):\/\/[\w-]+(\.[\w-]+)+(\:\d+)?(\/\S*)?)/gi;
        
        // Replace URLs with masked anchor tags
        return narration.replace(urlRegex, (url) => {
            // If the URL ends with punctuation (like a period), remove the trailing punctuation
            const cleanUrl = url.endsWith('.') ? url.slice(0, -1) : url;
            // Create the masked anchor tag with the URL as href and "View Link" as the visible text
            return `<a href="${cleanUrl}" target="_blank">View Link</a>`;
        });
    }


    // Function to add expense 
    function addExpense(event) { 
        event.preventDefault(); 

        const expenseNameInput = document.getElementById("expense-name");
        const expenseDateInput = document.getElementById("expense-date");
        const expenseCommentInput = document.getElementById("expense-comment");

        // Validate inputs 
        if (!expenseNameInput || !expenseDateInput || !expenseCommentInput) { 
            console.error("Error: Expense input elements not found.");
            return; 
        }

        const expenseName = expenseNameInput.value;
        const expenseDate = expenseDateInput.value;
        const expenseComment = expenseCommentInput.value;
        const username = localStorage.getItem("username"); // Retrieve the username from local storage

        if (expenseName === "" || expenseDate === "" || expenseComment === "" || !username) { 
            alert("Please enter valid expense details."); 
            return; 
        }

        // Create new expense object with associated username
        const expense = {                    
            name: expenseName,
            comment: expenseComment,
            date: expenseDate,
            username: username  // Store the username with the expense        
        }; 

        // Add expense to expenses array 
        expenses.push(expense); 

        // Clear form inputs 
        expenseNameInput.value = ""; 
        expenseCommentInput.value = "";

        // Render expenses 
        renderExpenses(); 
    } 

    // Function to delete expense
    function deleteExpense(event) {
        if (event.target.classList.contains("delete-btn")) {
            // Prompt the user for confirmation before deleting
            if (window.confirm("Are you sure you want to delete this expense?")) {
                // Get expense index from data-id attribute
                const expenseIndex = parseInt(event.target.getAttribute("data-id"));

                // Remove expense from expenses array
                expenses.splice(expenseIndex, 1);

                // Render expenses
                renderExpenses();
            }
        }
    }
	

    // Render initial expenses on page load 
    renderExpenses();

    // Function to add event listeners for edit buttons
    function addEditEventListeners() {
        const editButtons = document.querySelectorAll(".edit-btn");
        editButtons.forEach(button => {
            button.addEventListener("click", handleEditExpense);
        });
    }

    // Function to add event listeners for delete buttons
    function addDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", deleteExpense);
        });
    }

    // Function to handle editing an expense
    function handleEditExpense(event) {
        const expenseIndex = event.target.getAttribute("data-id");
        const expense = expenses[expenseIndex];

        // Populate the form fields with the expense details for editing
        const expenseNameInput = document.getElementById("expense-name");
        const expenseDateInput = document.getElementById("expense-date");
        const expenseCommentInput = document.getElementById("expense-comment");

        if (expenseNameInput && expenseDateInput && expenseCommentInput) {
            expenseNameInput.value = expense.name;
            expenseDateInput.value = expense.date;
            expenseCommentInput.value = expense.comment;

            // Add a hidden input field to store the expense index
            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "expense-index";
            hiddenInput.value = expenseIndex;
            expenseForm.appendChild(hiddenInput);

            // Change the form submit handler to handle editing
            expenseForm.removeEventListener("submit", addExpense);
            expenseForm.addEventListener("submit", updateExpense);
        } else {
            console.error("Error: Expense input elements not found.");
        }
    }

    // Function to update an expense
    function updateExpense(event) {
        event.preventDefault();

        const expenseIndex = parseInt(document.querySelector("input[name='expense-index']").value);
        const expenseName = document.getElementById("expense-name").value;
        const expenseDate = document.getElementById("expense-date").value;
        const expenseComment = document.getElementById("expense-comment").value;

        if (expenseName === "" || expenseDate === "" || expenseComment === "") {
            alert("Please enter valid expense details.");
            return;
        }

        // Update the expense object in the expenses array
        expenses[expenseIndex].name = expenseName;
        expenses[expenseIndex].date = expenseDate;
        expenses[expenseIndex].comment = expenseComment;

        // Clear the form and render the updated expenses
        expenseForm.reset();
        renderExpenses();

        // Change the form submit handler back to adding expense
        expenseForm.removeEventListener("submit", updateExpense);
        expenseForm.addEventListener("submit", addExpense);
    }

    // Add event listener to the expense form
    if (expenseForm) {
        expenseForm.addEventListener("submit", addExpense); 
    } else {
        console.error("Error: Expense form element not found.");
    }

    // Render initial expenses on page load 
    renderExpenses();
});
