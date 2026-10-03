const API_URL = "http://localhost:3000/api/expenses";

let expenses = [];


// ==============================
// Loading
// ==============================

function showLoading() {
    document
        .getElementById("loadingSpinner")
        .classList.remove("d-none");
}


function hideLoading() {
    document
        .getElementById("loadingSpinner")
        .classList.add("d-none");
}


// ==============================
// Alerts
// ==============================

function showAlert(message, type = "danger") {
    const alertContainer =
        document.getElementById("alertContainer");

    alertContainer.innerHTML = `
        <div
            class="alert alert-${type} alert-dismissible fade show"
            role="alert"
        >
            ${message}

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
            ></button>
        </div>
    `;
}


// ==============================
// GET Expenses
// ==============================

async function getExpenses() {
    showLoading();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load expenses.");
        }

        expenses = await response.json();

        return expenses;

    } catch (error) {

        showAlert(
            "Could not load expenses. Make sure the backend server is running."
        );

        throw error;

    } finally {

        hideLoading();
    }
}


// ==============================
// Render Table
// ==============================

function renderTable(list) {

    const tableBody =
        document.getElementById("expensesTableBody");

    tableBody.innerHTML = "";

    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="text-center text-muted"
                >
                    No expenses found.
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(expense => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(expense.title)}
            </td>

            <td>
                $${Number(expense.amount).toFixed(2)}
            </td>

            <td>
                <span class="badge bg-secondary">
                    ${escapeHtml(expense.category)}
                </span>
            </td>

            <td>
                ${escapeHtml(expense.date)}
            </td>

            <td>

                <button
                    class="btn btn-sm btn-warning me-1"
                    onclick="openEditModal(${expense.id})"
                >
                    Edit
                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);
    });
}


// ==============================
// Render Summary
// ==============================

function renderSummary(list) {

    const totalAmount =
        list.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );


    const expenseCount =
        list.length;


    const highestExpense =
        list.length > 0
            ? Math.max(
                ...list.map(
                    expense => Number(expense.amount)
                )
            )
            : 0;


    document.getElementById("totalAmount").textContent =
        `$${totalAmount.toFixed(2)}`;


    document.getElementById("expenseCount").textContent =
        expenseCount;


    document.getElementById("highestExpense").textContent =
        `$${highestExpense.toFixed(2)}`;
}


// ==============================
// Refresh
// ==============================

async function refresh() {

    try {

        const list = await getExpenses();

        applyFilter(list);

        renderSummary(expenses);

    } catch (error) {

        // Error already shown by getExpenses()
    }
}


// ==============================
// Filter
// ==============================

function applyFilter(list = expenses) {

    const category =
        document.getElementById("categoryFilter").value;


    if (category === "All") {

        renderTable(list);

        return;
    }


    const filtered =
        list.filter(
            expense =>
                expense.category === category
        );


    renderTable(filtered);
}


// ==============================
// Add Expense
// ==============================

async function addExpense(data) {

    showLoading();

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Failed to add expense."
            );
        }


        showAlert(
            "Expense added successfully.",
            "success"
        );


        await refresh();

    } catch (error) {

        showAlert(error.message);

    } finally {

        hideLoading();
    }
}


// ==============================
// Update Expense
// ==============================

async function updateExpense(id, data) {

    showLoading();

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to update expense."
            );
        }


        showAlert(
            "Expense updated successfully.",
            "success"
        );


        await refresh();

    } catch (error) {

        showAlert(error.message);

    } finally {

        hideLoading();
    }
}


// ==============================
// Delete Expense
// ==============================

async function deleteExpense(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {
        return;
    }


    showLoading();

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete expense."
            );
        }


        showAlert(
            "Expense deleted successfully.",
            "success"
        );


        await refresh();

    } catch (error) {

        showAlert(error.message);

    } finally {

        hideLoading();
    }
}


// ==============================
// Open Edit Modal
// ==============================

function openEditModal(id) {

    const expense =
        expenses.find(
            item => item.id === id
        );


    if (!expense) {

        showAlert(
            "Expense could not be found."
        );

        return;
    }


    document.getElementById("editId").value =
        expense.id;


    document.getElementById("editTitle").value =
        expense.title;


    document.getElementById("editAmount").value =
        expense.amount;


    document.getElementById("editCategory").value =
        expense.category;


    document.getElementById("editDate").value =
        expense.date;


    const modalElement =
        document.getElementById(
            "editExpenseModal"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();
}


// ==============================
// Escape HTML
// ==============================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// ==============================
// Clear Validation Errors
// ==============================

function clearValidationErrors() {
    document.getElementById("titleError").textContent = "";
    document.getElementById("amountError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    document.getElementById("dateError").textContent = "";
}

// ==============================
// Add Form Submit
// ==============================

document
    .getElementById("expenseForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            clearValidationErrors();


            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();


            const amount =
                document
                    .getElementById("amount")
                    .value;


            const category =
                document
                    .getElementById("category")
                    .value;


            const date =
                document
                    .getElementById("date")
                    .value;


            let valid = true;


            if (!title) {

                document.getElementById(
                    "titleError"
                ).textContent =
                    "Title is required.";

                valid = false;
            }


            if (
                amount === "" ||
                Number(amount) <= 0 ||
                !Number.isFinite(Number(amount))
            ) {

                document.getElementById(
                    "amountError"
                ).textContent =
                    "Amount must be greater than 0.";

                valid = false;
            }


            if (!category) {

                document.getElementById(
                    "categoryError"
                ).textContent =
                    "Category is required.";

                valid = false;
            }


            if (!date) {

                document.getElementById(
                    "dateError"
                ).textContent =
                    "Date is required.";

                valid = false;
            }


            if (!valid) {
                return;
            }


            await addExpense({

                title: title,

                amount: Number(amount),

                category: category,

                date: date
            });


            this.reset();
        }
    );


// ==============================
// Edit Form Submit
// ==============================

document
    .getElementById("editExpenseForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                Number(
                    document
                        .getElementById("editId")
                        .value
                );


            const data = {

                title:
                    document
                        .getElementById("editTitle")
                        .value
                        .trim(),

                amount:
                    Number(
                        document
                            .getElementById("editAmount")
                            .value
                    ),

                category:
                    document
                        .getElementById("editCategory")
                        .value,

                date:
                    document
                        .getElementById("editDate")
                        .value
            };


            if (!data.title) {

                showAlert(
                    "Title is required."
                );

                return;
            }


            if (
                !Number.isFinite(data.amount) ||
                data.amount <= 0
            ) {

                showAlert(
                    "Amount must be greater than 0."
                );

                return;
            }


            if (!data.category) {

                showAlert(
                    "Category is required."
                );

                return;
            }


            if (!data.date) {

                showAlert(
                    "Date is required."
                );

                return;
            }


            await updateExpense(
                id,
                data
            );


            const modalElement =
                document.getElementById(
                    "editExpenseModal"
                );


            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );


            if (modal) {
                modal.hide();
            }
        }
    );


// ==============================
// Category Filter
// ==============================

document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        function () {

            applyFilter();

        }
    );


// ==============================
// Start Application
// ==============================

refresh();