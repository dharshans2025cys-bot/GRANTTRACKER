const API = "http://localhost:8080/api";

let applications = [];


/* ================= INITIAL LOAD ================= */

document.addEventListener("DOMContentLoaded", () => {

    loadApplications();

    document
        .getElementById("applicationForm")
        .addEventListener("submit", submitApplication);

    document
        .getElementById("expenditureForm")
        .addEventListener("submit", submitExpenditure);

});


/* ================= LOAD APPLICATIONS ================= */

async function loadApplications() {

    try {

        const response = await fetch(`${API}/applications`);

        if (!response.ok) {
            throw new Error("Unable to load applications");
        }

        applications = await response.json();

        displayApplications(applications);

        updateDashboard();

    } catch (error) {

        console.error(error);

        document.getElementById("applicationTableBody").innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    Unable to connect to Spring Boot.
                    <br>
                    Make sure the backend is running on port 8080.
                </td>
            </tr>
        `;

    }

}


/* ================= GET STATUS ================= */

function getApplicationStatus(app) {

    if (app.stage && app.stage.name) {
        return app.stage.name
            .trim()
            .toUpperCase()
            .replaceAll(" ", "_");
    }

    return "SUBMITTED";
}


/* ================= DISPLAY ================= */

function displayApplications(data) {

    const tbody =
        document.getElementById("applicationTableBody");

    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    No grant applications found.
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML = data.map(app => {

        const status = getApplicationStatus(app);

        return `
            <tr>

                <td>
                    <strong>#${app.id}</strong>
                </td>

                <td>
                    <strong>${escapeHTML(app.title)}</strong>
                    <small>Research Grant</small>
                </td>

                <td>
                    ${escapeHTML(
                        app.faculty
                            ? app.faculty.name
                            : "N/A"
                    )}
                </td>

                <td>
                    ₹${formatNumber(app.requestedAmount)}
                </td>

                <td>
                    <span class="status ${status}">
                        ${formatStatus(status)}
                    </span>
                </td>

                <td>
                    ${formatDate(app.submittedDate)}
                </td>

                <td>
                    <button
                        class="action-button"
                        onclick="viewApplication(${app.id})">
                        View
                    </button>
                </td>

            </tr>
        `;

    }).join("");

}


/* ================= SUBMIT APPLICATION ================= */

async function submitApplication(event) {

    event.preventDefault();

    const application = {

        title:
            document.getElementById("title")
                .value
                .trim(),

        requestedAmount:
            Number(
                document.getElementById("requestedAmount")
                    .value
            ),

        abstractText:
            document.getElementById("abstractText")
                .value
                .trim()

    };


    if (
        !application.title ||
        !application.requestedAmount ||
        !application.abstractText
    ) {

        showToast("Please fill all required fields.");

        return;
    }


    try {

        const response = await fetch(
            `${API}/applications`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(application)

            }
        );


        if (!response.ok) {

            const message = await response.text();

            throw new Error(
                message || "Application submission failed"
            );

        }


        closeApplicationModal();

        document
            .getElementById("applicationForm")
            .reset();

        showToast(
            "Grant application submitted successfully."
        );

        loadApplications();


    } catch (error) {

        showToast(error.message);

    }

}


/* ================= EXPENDITURE ================= */

async function submitExpenditure(event) {

    event.preventDefault();


    const applicationId =
        Number(
            document.getElementById(
                "expenditureApplicationId"
            ).value
        );

    const expenditure = {

        amount:
            Number(
                document.getElementById(
                    "expenditureAmount"
                ).value
            ),

        description:
            document.getElementById(
                "expenditureDescription"
            ).value
            .trim()

    };


    try {

        const response = await fetch(
            `${API}/applications/${applicationId}/expenditures`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(expenditure)

            }
        );


        if (!response.ok) {

            const message = await response.text();

            throw new Error(
                message || "Unable to record expenditure"
            );

        }


        closeExpenditureModal();

        document
            .getElementById("expenditureForm")
            .reset();

        showToast(
            "Expenditure recorded successfully."
        );

        loadApplications();

    }

    catch (error) {

        showToast(error.message);

    }

}


/* ================= FILTER ================= */

function filterApplications() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const selectedStatus =
        document
            .getElementById("statusFilter")
            .value;


    const filtered =
        applications.filter(app => {

            const matchesSearch =
                (app.title || "")
                    .toLowerCase()
                    .includes(search) ||

                (
                    app.faculty
                        ? app.faculty.name || ""
                        : ""
                )
                    .toLowerCase()
                    .includes(search);


            const appStatus =
                getApplicationStatus(app);


            const matchesStatus =
                selectedStatus === "ALL" ||
                appStatus === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    displayApplications(filtered);

}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const total = applications.length;


    const review =
        applications.filter(app => {

            return getApplicationStatus(app) ===
                "UNDER_REVIEW";

        }).length;


    const approved =
        applications.filter(app => {

            return getApplicationStatus(app) ===
                "APPROVED";

        }).length;


    document.getElementById(
        "totalApplications"
    ).textContent = total;


    document.getElementById(
        "reviewApplications"
    ).textContent = review;


    document.getElementById(
        "approvedApplications"
    ).textContent = approved;

}


/* ================= VIEW APPLICATION ================= */

async function viewApplication(id) {

    try {

        const response =
            await fetch(
                `${API}/applications/${id}`
            );


        if (!response.ok) {
            throw new Error(
                "Application not found"
            );
        }


        const app =
            await response.json();


        const status =
            getApplicationStatus(app);


        const facultyName =
            app.faculty
                ? app.faculty.name
                : "N/A";


        alert(

            `Grant Application\n\n` +

            `ID: ${app.id}\n` +

            `Title: ${app.title}\n` +

            `Faculty: ${facultyName}\n` +

            `Amount: ₹${formatNumber(
                app.requestedAmount
            )}\n` +

            `Status: ${formatStatus(
                status
            )}\n\n` +

            `Abstract:\n${
                app.abstractText || "N/A"
            }`

        );

    }

    catch (error) {

        showToast(error.message);

    }

}


/* ================= MODALS ================= */

function openApplicationModal() {

    document
        .getElementById("applicationModal")
        .classList.add("show");

}


function closeApplicationModal() {

    document
        .getElementById("applicationModal")
        .classList.remove("show");

}


function openExpenditureModal() {

    document
        .getElementById("expenditureModal")
        .classList.add("show");

}


function closeExpenditureModal() {

    document
        .getElementById("expenditureModal")
        .classList.remove("show");

}


/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* ================= HELPERS ================= */

function formatNumber(number) {

    return Number(number || 0)
        .toLocaleString("en-IN");

}


function formatStatus(status) {

    if (!status) {
        return "Submitted";
    }

    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, c => c.toUpperCase());

}


function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date)
        .toLocaleDateString("en-IN");

}


function escapeHTML(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ================= CLOSE MODAL ON OUTSIDE CLICK ================= */

window.addEventListener("click", event => {

    if (event.target.classList.contains("modal")) {

        event.target.classList.remove("show");

    }

});