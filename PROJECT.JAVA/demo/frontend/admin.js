const API = "http://localhost:8080/api";

let applications = [];
let selectedApplicationId = null;


/* =========================================
   INITIAL LOAD
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadApplications();
});


/* =========================================
   LOAD APPLICATIONS
========================================= */

async function loadApplications() {

    try {

        const response =
            await fetch(`${API}/applications`);

        if (!response.ok) {
            throw new Error(
                "Unable to load applications"
            );
        }

        applications =
            await response.json();

        displayApplications(applications);

        await updateDashboard();

    } catch (error) {

        console.error(error);

        const tableBody =
            document.getElementById(
                "applicationTableBody"
            );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7"
                        class="loading">

                        Unable to connect to Spring Boot.

                        <br><br>

                        Make sure the backend
                        is running on port 8080.

                    </td>
                </tr>
            `;
        }
    }
}


/* =========================================
   GET APPLICATION STATUS
========================================= */

function getStatus(application) {

    if (
        application &&
        application.stage &&
        application.stage.name
    ) {

        return application.stage.name
            .trim()
            .toUpperCase()
            .replaceAll(" ", "_");
    }

    return "SUBMITTED";
}


/* =========================================
   DISPLAY APPLICATIONS
========================================= */

function displayApplications(data) {

    const tbody =
        document.getElementById(
            "applicationTableBody"
        );

    if (!tbody) {
        return;
    }

    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7"
                    class="empty-state">

                    No grant applications found.

                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        data.map(application => {

            const status =
                getStatus(application);

            const statusText =
                formatStatus(status);

            const canReview =
                status === "SUBMITTED" ||
                status === "UNDER_REVIEW";


            return `
                <tr>

                    <td>
                        <strong>
                            #${application.id}
                        </strong>
                    </td>


                    <td>

                        <strong>
                            ${escapeHTML(
                                application.title
                            )}
                        </strong>

                        <small>
                            Research Grant
                        </small>

                    </td>


                    <td>

                        ${
                            application.faculty
                            ? escapeHTML(
                                application.faculty.name
                            )
                            : "N/A"
                        }

                    </td>


                    <td>

                        ₹${formatNumber(
                            application.requestedAmount
                        )}

                    </td>


                    <td>

                        <span class="status ${status}">
                            ${statusText}
                        </span>

                    </td>


                    <td>

                        ${canReview
                            ? `
                                <button
                                    class="action-button"
                                    onclick="openReviewModal(${application.id})">

                                    Review

                                </button>
                              `
                            : `
                                <button
                                    class="action-button"
                                    onclick="openReviewModal(${application.id})">

                                    View

                                </button>
                              `
                        }

                    </td>

                </tr>
            `;

        }).join("");
}


/* =========================================
   REVIEW APPLICATION
========================================= */

async function openReviewModal(id) {

    selectedApplicationId = id;

    try {

        const applicationResponse =
            await fetch(
                `${API}/applications/${id}`
            );


        if (!applicationResponse.ok) {

            throw new Error(
                "Application not found"
            );
        }


        const application =
            await applicationResponse.json();


        /*
         * GET EXPENDITURES
         */

        const expenditureResponse =
            await fetch(
                `${API}/applications/${id}/expenditures`
            );


        let expenditures = [];


        if (expenditureResponse.ok) {

            expenditures =
                await expenditureResponse.json();
        }


        /*
         * CALCULATE TOTAL EXPENDITURE
         */

        const totalExpenditure =
            expenditures.reduce(
                (total, expense) => {

                    return total +
                        Number(
                            expense.amount || 0
                        );

                },
                0
            );


        const requestedAmount =
            Number(
                application.requestedAmount || 0
            );


        const remainingAmount =
            requestedAmount -
            totalExpenditure;


        const status =
            getStatus(application);


        /*
         * FACULTY NAME
         */

        const facultyName =
            application.faculty
                ? application.faculty.name
                : "Not assigned";


        /*
         * EXPENDITURE HTML
         */

        let expenditureHTML = "";


        if (
            !expenditures ||
            expenditures.length === 0
        ) {

            expenditureHTML = `
                <div style="
                    padding:16px;
                    border-radius:10px;
                    background:#f8f9fc;
                    color:#777;
                    text-align:center;
                ">

                    No expenditure recorded yet.

                </div>
            `;

        } else {

            expenditureHTML =
                expenditures.map(
                    expense => {

                        return `
                            <div style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                padding:12px 0;
                                border-bottom:1px solid #eeeeee;
                            ">

                                <div>

                                    <strong>
                                        ${escapeHTML(
                                            expense.description ||
                                            "Expense"
                                        )}
                                    </strong>

                                </div>


                                <strong>

                                    ₹${formatNumber(
                                        expense.amount
                                    )}

                                </strong>

                            </div>
                        `;

                    }
                ).join("");
        }


        /*
         * REMOVE OLD MODAL
         */

        const oldModal =
            document.getElementById(
                "grantReviewModal"
            );

        if (oldModal) {
            oldModal.remove();
        }


        /*
         * CREATE REVIEW MODAL
         */

        const modal =
            document.createElement("div");

        modal.id =
            "grantReviewModal";


        modal.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(15,23,42,0.65);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:9999;
            padding:20px;
        `;


        modal.innerHTML = `

            <div style="
                width:100%;
                max-width:700px;
                max-height:90vh;
                overflow-y:auto;
                background:white;
                border-radius:18px;
                padding:30px;
                box-shadow:0 25px 70px rgba(0,0,0,0.25);
            ">


                <!-- HEADER -->

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:25px;
                ">

                    <div>

                        <div style="
                            font-size:12px;
                            font-weight:700;
                            letter-spacing:1.5px;
                            color:#5146d8;
                            text-transform:uppercase;
                        ">
                            Grant Application
                        </div>


                        <h2 style="
                            margin:6px 0 0;
                            font-size:24px;
                            color:#172033;
                        ">
                            ${escapeHTML(
                                application.title
                            )}
                        </h2>

                    </div>


                    <button
                        onclick="closeReviewModal()"
                        style="
                            border:none;
                            background:#f1f3f7;
                            width:40px;
                            height:40px;
                            border-radius:10px;
                            font-size:20px;
                            cursor:pointer;
                        ">

                        ×

                    </button>

                </div>


                <!-- APPLICATION DETAILS -->

                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(2, 1fr);
                    gap:15px;
                    margin-bottom:25px;
                ">


                    <div style="
                        background:#f8f9fc;
                        padding:15px;
                        border-radius:12px;
                    ">

                        <small>
                            Application ID
                        </small>

                        <strong style="
                            display:block;
                            margin-top:5px;
                        ">
                            #${application.id}
                        </strong>

                    </div>


                    <div style="
                        background:#f8f9fc;
                        padding:15px;
                        border-radius:12px;
                    ">

                        <small>
                            Faculty
                        </small>

                        <strong style="
                            display:block;
                            margin-top:5px;
                        ">
                            ${escapeHTML(
                                facultyName
                            )}
                        </strong>

                    </div>


                    <div style="
                        background:#f8f9fc;
                        padding:15px;
                        border-radius:12px;
                    ">

                        <small>
                            Requested Amount
                        </small>

                        <strong style="
                            display:block;
                            margin-top:5px;
                        ">
                            ₹${formatNumber(
                                requestedAmount
                            )}
                        </strong>

                    </div>


                    <div style="
                        background:#f8f9fc;
                        padding:15px;
                        border-radius:12px;
                    ">

                        <small>
                            Status
                        </small>

                        <strong style="
                            display:block;
                            margin-top:5px;
                        ">
                            ${formatStatus(status)}
                        </strong>

                    </div>

                </div>


                <!-- ABSTRACT -->

                <div style="
                    margin-bottom:25px;
                ">

                    <h3 style="
                        margin-bottom:10px;
                    ">
                        Research Abstract
                    </h3>


                    <div style="
                        background:#f8f9fc;
                        padding:16px;
                        border-radius:12px;
                        line-height:1.6;
                    ">

                        ${escapeHTML(
                            application.abstractText ||
                            "No abstract provided."
                        )}

                    </div>

                </div>


                <!-- EXPENDITURE -->

                <div style="
                    margin-bottom:25px;
                ">

                    <h3 style="
                        margin-bottom:15px;
                    ">
                        Expenditure
                    </h3>


                    ${expenditureHTML}


                    <!-- TOTALS -->

                    <div style="
                        margin-top:15px;
                        padding:18px;
                        background:#f8f9fc;
                        border-radius:12px;
                    ">


                        <div style="
                            display:flex;
                            justify-content:space-between;
                            margin-bottom:10px;
                        ">

                            <span>
                                Approved / Requested Limit
                            </span>

                            <strong>
                                ₹${formatNumber(
                                    requestedAmount
                                )}
                            </strong>

                        </div>


                        <div style="
                            display:flex;
                            justify-content:space-between;
                            margin-bottom:10px;
                        ">

                            <span>
                                Total Utilized
                            </span>

                            <strong>
                                ₹${formatNumber(
                                    totalExpenditure
                                )}
                            </strong>

                        </div>


                        <div style="
                            display:flex;
                            justify-content:space-between;
                            padding-top:10px;
                            border-top:
                                1px solid #ddd;
                        ">

                            <strong>
                                Remaining
                            </strong>

                            <strong>
                                ₹${formatNumber(
                                    remainingAmount
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- ACTION BUTTONS -->

                <div style="
                    display:flex;
                    justify-content:flex-end;
                    gap:10px;
                ">


                    <button
                        onclick="closeReviewModal()"
                        style="
                            padding:12px 20px;
                            border:none;
                            border-radius:10px;
                            background:#f1f3f7;
                            cursor:pointer;
                        ">

                        Close

                    </button>


                    ${
                        status === "SUBMITTED" ||
                        status === "UNDER_REVIEW"

                        ? `

                            <button
                                onclick="approveApplication(${application.id})"
                                style="
                                    padding:12px 20px;
                                    border:none;
                                    border-radius:10px;
                                    background:#16a34a;
                                    color:white;
                                    font-weight:600;
                                    cursor:pointer;
                                ">

                                ✓ Approve

                            </button>


                            <button
                                onclick="rejectApplication(${application.id})"
                                style="
                                    padding:12px 20px;
                                    border:none;
                                    border-radius:10px;
                                    background:#dc2626;
                                    color:white;
                                    font-weight:600;
                                    cursor:pointer;
                                ">

                                ✕ Reject

                            </button>

                        `
                        : ""
                    }

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        /*
         * CLOSE WHEN CLICKING OUTSIDE
         */

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeReviewModal();

                }

            }
        );


    } catch (error) {

        console.error(error);

        showToast(
            error.message ||
            "Unable to load application details"
        );
    }
}


/* =========================================
   CLOSE REVIEW MODAL
========================================= */

function closeReviewModal() {

    const modal =
        document.getElementById(
            "grantReviewModal"
        );

    if (modal) {
        modal.remove();
    }

    selectedApplicationId = null;
}


/* =========================================
   APPROVE APPLICATION
========================================= */

async function approveApplication(id) {

    if (
        !confirm(
            "Are you sure you want to approve this application?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/applications/${id}/approve`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const error =
                await response.json()
                    .catch(() => null);

            throw new Error(
                error?.error ||
                "Unable to approve application"
            );
        }


        closeReviewModal();

        showToast(
            "Application approved successfully."
        );


        await loadApplications();


    } catch (error) {

        console.error(error);

        showToast(
            error.message
        );
    }
}


/* =========================================
   REJECT APPLICATION
========================================= */

async function rejectApplication(id) {

    if (
        !confirm(
            "Are you sure you want to reject this application?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/applications/${id}/reject`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const error =
                await response.json()
                    .catch(() => null);

            throw new Error(
                error?.error ||
                "Unable to reject application"
            );
        }


        closeReviewModal();

        showToast(
            "Application rejected successfully."
        );


        await loadApplications();


    } catch (error) {

        console.error(error);

        showToast(
            error.message
        );
    }
}


/* =========================================
   DASHBOARD
========================================= */

async function updateDashboard() {

    const total =
        applications.length;


    const review =
        applications.filter(
            application =>
                getStatus(application) ===
                "UNDER_REVIEW"
        ).length;


    const approved =
        applications.filter(
            application =>
                getStatus(application) ===
                "APPROVED"
        ).length;


    /*
     * Calculate total expenditure
     */

    let totalUtilized = 0;


    try {

        const expenditureLists =
            await Promise.all(

                applications.map(
                    async application => {

                        try {

                            const response =
                                await fetch(
                                    `${API}/applications/${application.id}/expenditures`
                                );


                            if (!response.ok) {
                                return [];
                            }


                            return await response.json();

                        } catch {

                            return [];

                        }

                    }
                )
            );


        expenditureLists.forEach(
            expenditures => {

                expenditures.forEach(
                    expense => {

                        totalUtilized +=
                            Number(
                                expense.amount || 0
                            );

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Unable to calculate expenditure",
            error
        );

    }


    /*
     * Update dashboard cards
     */

    const totalElement =
        document.getElementById(
            "totalApplications"
        );


    const reviewElement =
        document.getElementById(
            "reviewApplications"
        );


    const approvedElement =
        document.getElementById(
            "approvedApplications"
        );


    const utilizedElement =
        document.getElementById(
            "totalUtilized"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (reviewElement) {

        reviewElement.textContent =
            review;

    }


    if (approvedElement) {

        approvedElement.textContent =
            approved;

    }


    if (utilizedElement) {

        utilizedElement.textContent =
            "₹" +
            formatNumber(
                totalUtilized
            );

    }
}


/* =========================================
   SEARCH / FILTER
========================================= */

function filterApplications() {

    const searchElement =
        document.getElementById(
            "searchInput"
        );


    const statusElement =
        document.getElementById(
            "statusFilter"
        );


    const search =
        searchElement
            ? searchElement.value
                .toLowerCase()
            : "";


    const status =
        statusElement
            ? statusElement.value
            : "ALL";


    const filtered =
        applications.filter(
            application => {

                const facultyName =
                    application.faculty
                        ? application.faculty.name
                        : "";


                const title =
                    application.title || "";


                const matchesSearch =
                    title
                        .toLowerCase()
                        .includes(search) ||

                    facultyName
                        .toLowerCase()
                        .includes(search);


                const applicationStatus =
                    getStatus(application);


                const matchesStatus =
                    status === "ALL" ||
                    applicationStatus === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    displayApplications(filtered);
}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "adminToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "adminToast";


        toast.style.cssText = `
            position:fixed;
            right:25px;
            bottom:25px;
            background:#111827;
            color:white;
            padding:14px 20px;
            border-radius:10px;
            z-index:10000;
            font-size:14px;
            box-shadow:
                0 10px 30px
                rgba(0,0,0,0.2);
        `;


        document.body.appendChild(toast);
    }


    toast.textContent =
        message;


    toast.style.display =
        "block";


    clearTimeout(
        window.adminToastTimer
    );


    window.adminToastTimer =
        setTimeout(
            () => {

                toast.style.display =
                    "none";

            },
            3500
        );
}


/* =========================================
   HELPERS
========================================= */

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
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================
   AUTO REFRESH
========================================= */

setInterval(
    () => {

        loadApplications();

    },
    30000
);