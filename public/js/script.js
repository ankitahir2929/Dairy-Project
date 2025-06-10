(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

async function getCustName() {
  const customerNo = document.getElementById("custNo").value;

  if (!customerNo) {
    document.getElementById("custName").value = "";
    return;
  }

  try {
    const response = await fetch(`/get-customer/${customerNo}`);
    const data = await response.json();

    document.getElementById("custName").value =
      data.customerName || "Not Found";
  } catch (error) {
    console.error("Error fetching customer:", error);
    document.getElementById("custName").value = "Error!";
  }
}

async function getProName() {
  const productNo = document.getElementById("proNo").value;

  if (!productNo) {
    document.getElementById("proName").value = "";
    document.getElementById("proPrice").value = "";
    return;
  }

  try {
    const response = await fetch(`/get-product/${productNo}`);
    const data = await response.json();

    document.getElementById("proName").value = data.productName || "Not Found";
    document.getElementById("proPrice").value =
      data.productPrice || "Not Found";
  } catch (error) {
    console.error("Error fetching product:", error);
    document.getElementById("proName").value = "Error!";
  }
}

// document.addEventListener("DOMContentLoaded", function () {
//   // Use event delegation for dynamic elements
//   document.addEventListener("click", function (e) {
//     // Open modal when any open button is clicked
//     if (e.target.classList.contains("openDateModal")) {
//       const customerId = e.target.getAttribute("data-customer-id");
//       const modal = document.getElementById(`dateModal-${customerId}`);
//       modal.style.display = "flex";
//       document.body.classList.add("modal-open");

//       // Auto-fill dates for this specific modal
//       autoFillDates(customerId);

//       // Set minimum end date to start date
//       const startDateInput = document.getElementById(`startDate-${customerId}`);
//       const endDateInput = document.getElementById(`endDate-${customerId}`);

//       startDateInput.addEventListener("change", function () {
//         endDateInput.min = this.value;
//       });
//       startDateInput.focus();
//     }

//     // Close modal when any cancel button is clicked
//     if (e.target.classList.contains("cancelDates")) {
//       const modal = e.target.closest(".dateModal");
//       closeModal(modal);
//     }
//   });

//   // Close modal when clicking outside
//   document.addEventListener("click", function (e) {
//     if (e.target.classList.contains("dateModal")) {
//       closeModal(e.target);
//     }
//   });

//   // Close modal with Escape key
//   document.addEventListener("keydown", function (e) {
//     if (e.key === "Escape" && document.body.classList.contains("modal-open")) {
//       const openModal = document.querySelector(
//         '.dateModal[style="display: flex;"]'
//       );
//       if (openModal) {
//         closeModal(openModal);
//       }
//     }
//   });

//   // Modified autoFillDates to work with specific customer modals
//   function autoFillDates(customerId) {
//     const today = new Date();
//     const currentDay = today.getDate();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();
//     const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

//     let startDate, endDate;

//     if (currentDay <= 15) {
//       startDate = new Date(currentYear, currentMonth, 1);
//       endDate = new Date(currentYear, currentMonth, 15);
//     } else {
//       startDate = new Date(currentYear, currentMonth, 16);
//       endDate = new Date(currentYear, currentMonth, lastDay);
//     }

//     function formatDate(date) {
//       const d = new Date(date);
//       let month = "" + (d.getMonth() + 1);
//       let day = "" + d.getDate();
//       const year = d.getFullYear();

//       if (month.length < 2) month = "0" + month;
//       if (day.length < 2) day = "0" + day;

//       return [year, month, day].join("-");
//     }

//     document.getElementById(`startDate-${customerId}`).value =
//       formatDate(startDate);
//     document.getElementById(`endDate-${customerId}`).value =
//       formatDate(endDate);
//   }

//   function closeModal(modal) {
//     modal.style.display = "none";
//     document.body.classList.remove("modal-open");
//   }
// });
document.addEventListener("DOMContentLoaded", function () {
  const openModalBtn = document.querySelectorAll(".openDateModal");
  const dateModal = document.getElementById("dateModal");
  const cancelBtn = document.getElementById("cancelDates");
  const submitBtn = document.getElementById("submitDates");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const body = document.body;

  // Function to get the last day of current month
  function getLastDayOfMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  // Auto-fill dates based on current date
  function autoFillDates() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastDay = getLastDayOfMonth();

    let startDate, endDate;

    if (currentDay <= 15) {
      // First half of month: 1st to 15th
      startDate = new Date(currentYear, currentMonth, 1);
      endDate = new Date(currentYear, currentMonth, 15);
    } else {
      // Second half of month: 16th to last day
      startDate = new Date(currentYear, currentMonth, 16);
      endDate = new Date(currentYear, currentMonth, lastDay);
    }

    // Format dates as YYYY-MM-DD for input fields
    function formatDate(date) {
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }

    startDateInput.value = formatDate(startDate);
    endDateInput.value = formatDate(endDate);
  }

  // Open modal function
  function openModal() {
    dateModal.style.display = "flex";
    body.classList.add("modal-open");
    autoFillDates(); // Auto-fill dates when modal opens
    startDateInput.focus();

    // Set minimum end date to start date
    startDateInput.addEventListener("change", function () {
      endDateInput.min = this.value;
    });
  }

  // Close modal function
  function closeModal() {
    dateModal.style.display = "none";
    body.classList.remove("modal-open");
  }

  // Event listeners
  openModalBtn.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  cancelBtn.addEventListener("click", function (e) {
    e.preventDefault(); // This prevents form submission
    closeModal();
  });

  submitBtn.addEventListener("click", function () {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("End date must be after start date");
      return;
    }

    console.log("Selected date range:", { startDate, endDate });
    closeModal();
  });

  // Close modal when clicking outside
  dateModal.addEventListener("click", function (e) {
    if (e.target === dateModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("modal-open")) {
      closeModal();
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const totalAmountElement = document.getElementById("totalAmount"); // Get the element
  const totalAmount = parseFloat(totalAmountElement.textContent); // Convert text to number

  if (totalAmount >= 0) {
    totalAmountElement.style.backgroundColor = "#FCF1E3";
    totalAmountElement.style.color = "#2E7D32";
  } else {
    totalAmountElement.style.backgroundColor = "#FCF1E3";
    totalAmountElement.style.color = "#E8492A";
  }
});
