// Load config if available, otherwise use default
const API_URL = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:3000';

document.getElementById("bmiForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  let height = parseFloat(document.getElementById("Height").value);
  let weight = parseFloat(document.getElementById("Weight").value);

  
  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    document.getElementById("result").innerText =
      "⚠️ Please enter valid values.";
    return;
  }
  if (height < 50 || height > 250 || weight < 10 || weight > 300) {
    document.getElementById("result").innerText =
      "⚠️ Please enter realistic values.";
    return;
  }

  let bmi = weight / ((height / 100) ** 2);
  document.getElementById(
    "result"
  ).innerText = `✅ Your BMI is ${bmi.toFixed(2)}`;

  // Save to database
  await saveBMIResult(height, weight, bmi);
  
  // Reload history
  await loadHistory();
});

async function saveBMIResult(height, weight, bmi) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No authentication token found');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/bmi`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ height, weight, bmi: parseFloat(bmi.toFixed(2)) })
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Error saving BMI:', error);
    }
  } catch (error) {
    console.error('Error saving BMI:', error);
  }
}

async function loadHistory() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/bmi/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      showHistory(data.records);
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

function showHistory(records) {
  const historyDiv = document.getElementById("history");
  let output = "<h2 class='font-bold text-lg text-cyan-300 mb-2'>Your BMI History</h2>";

  if (!records || records.length === 0) {
    historyDiv.innerHTML = output + "<p class='text-gray-300'>No records yet.</p>";
    return;
  }

  output += "<ul class='space-y-1'>";
  records.forEach((record) => {
    const date = new Date(record.recorded_at).toLocaleString();
    output += `<li class='text-gray-200'>${date} → BMI: ${record.bmi.toFixed(2)} (H: ${record.height}cm, W: ${record.weight}kg)</li>`;
  });
  output += "</ul>";
  historyDiv.innerHTML = output;
}

// Load history on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHistory);
} else {
  loadHistory();
}

function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  const goToLogin = () => window.location.href = 'login.html';
  const goToSignup = () => window.location.href = 'signup.html';

  fetch('login.html', { method: 'HEAD', cache: 'no-store' })
    .then(response => {
      if (response.ok) {
        goToLogin();
      } else {
        goToSignup();
      }
    })
    .catch(() => goToSignup());
}

// expose for inline handlers
window.logout = logout;
