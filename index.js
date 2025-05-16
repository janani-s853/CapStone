document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const warning = document.getElementById("warning");
  const entriesBody = document.getElementById("entriesBody");
  const dobInput = document.getElementById("dob");
  const today = new Date();
  const yyyy = today.getFullYear();

  const maxDate = new Date(yyyy - 18, today.getMonth(), today.getDate());
  const minDate = new Date(yyyy - 55, today.getMonth(), today.getDate());
  dobInput.max = maxDate.toISOString().split("T")[0];
  dobInput.min = minDate.toISOString().split("T")[0];

  function getAge(dob) {
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function loadEntries() {
    const entries = JSON.parse(localStorage.getItem("registrations")) || [];
    entriesBody.innerHTML = "";
    entries.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-4 py-2">${entry.name}</td>
        <td class="border px-4 py-2">${entry.email}</td>
        <td class="border px-4 py-2">${entry.password}</td>
        <td class="border px-4 py-2">${entry.dob}</td>
        <td class="border px-4 py-2">${entry.terms ? "Yes" : "No"}</td>
      `;
      entriesBody.appendChild(row);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const dob = document.getElementById("dob").value;
    const terms = document.getElementById("terms").checked;

    const age = getAge(dob);
    warning.style.display = "none";

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      warning.textContent = "Please enter a valid email address.";
      warning.style.display = "block";
      return;
    }

    if (age < 18 || age > 55) {
      warning.textContent = "Age must be between 18 and 55 years.";
      warning.style.display = "block";
      return;
    }

    if (!terms) {
      warning.textContent = "You must accept the terms and conditions.";
      warning.style.display = "block";
      return;
    }

    const entry = { name, email, password, dob, terms };
    const entries = JSON.parse(localStorage.getItem("registrations")) || [];
    entries.push(entry);
    localStorage.setItem("registrations", JSON.stringify(entries));

    form.reset();
    loadEntries();
  });

  loadEntries();
});
