const form = document.getElementById('nationalIdForm');
const nationalIdInput = document.getElementById('nationalId');
const errorMessage = document.getElementById('errorMessage');
const accountResult = document.getElementById('accountResult');
const usernameValue = document.getElementById('usernameValue');
const passwordValue = document.getElementById('passwordValue');
const fullNameValue = document.getElementById('fullNameValue');

document.addEventListener("keydown", e => {
    // F12
    if (e.key === "F12") {
        e.preventDefault();
    }

    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
    }

    // Ctrl + Shift + J
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
    }

    // Ctrl + U
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
    }
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const value = nationalIdInput.value.trim();
    console.log(value);

    if (!/^\d{14}$/.test(value)) {
        errorMessage.textContent = 'الرقم القومي غير صحيح. يجب أن يتكون من 14 رقم فقط.';
        accountResult.classList.add('hidden');
        nationalIdInput.focus();
        return;
    }

    errorMessage.textContent = '';

    searchUser(value).then(user => {
        if (user) {
            usernameValue.textContent = user.UserName;
            passwordValue.textContent = user.Password;
            fullNameValue.textContent = user['Full Name'] || '-';
            FacultyValue.textContent = user.Faculty;
        } else {
            errorMessage.textContent = 'لم يتم العثور على مستخدم لهذا الرقم القومي.';
        }
        accountResult.classList.remove('hidden');
    });
});

nationalIdInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 14);
    if (errorMessage.textContent) {
        errorMessage.textContent = '';
    }
});






let users = [];

async function loadUsers() {
    const response = await fetch("./assets/BSU_Users.xlsx");

    if (!response.ok) {
        throw new Error(`Failed to load Excel: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    users = XLSX.utils.sheet_to_json(sheet, {
        defval: ""
    });

    console.log("Users loaded:", users.length);
}

// Search and return the matching row as an object
async function searchUser(nationalId) {
    if (users.length === 0) {
        await loadUsers();
    }

    const user = users.find(row =>
        String(row.Password ?? "").toLowerCase() ===
        nationalId.trim().toLowerCase()
    );

    return user ?? null;
}

