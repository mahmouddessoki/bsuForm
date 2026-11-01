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

    if (!/^\d{14}$/.test(value)) {
        errorMessage.textContent = 'الرقم القومي غير صحيح. يجب أن يتكون من 14 رقم فقط.';
        accountResult.classList.add('hidden');
        nationalIdInput.focus();
        return;
    }

    errorMessage.textContent = '';

    loadUser(value).then(user => {
        if (user) {
            usernameValue.textContent = user.UserName;
            passwordValue.textContent = user.Password;
            fullNameValue.textContent = user['Full Name'] || '-';
            FacultyValue.textContent = user.Faculty;
            accountResult.classList.remove('hidden');
        } else {
            errorMessage.textContent = 'لم يتم العثور على مستخدم لهذا الرقم القومي.';
        }
    });
});

nationalIdInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 14);
    if (errorMessage.textContent) {
        errorMessage.textContent = '';
    }
});






let users = [];

async function loadUser(nationalId) {
    const url =
        "https://docs.google.com/spreadsheets/d/17PfOr8GuGkyn0O9h48FxtHTOPWaj9znH/export?format=xlsx&gid=1438745695";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load Excel: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    const workbook = XLSX.read(buffer, {
        type: "array"
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const users = XLSX.utils.sheet_to_json(sheet, {
        defval: ""
    });


    const user = users.find(row =>
        String(row.Password).trim() === String(nationalId).trim()
    );

    return user || null;
}

// Search and return the matching row as an object




document.addEventListener("keydown", function (e) {
    // F12
    if (e.key === "F12") {
        e.preventDefault();
        return false;
    }

    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        return false;
    }

    // Ctrl + Shift + J
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        return false;
    }

    // Ctrl + U (View Source)
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        return false;
    }
});

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});