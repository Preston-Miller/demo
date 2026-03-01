/**
 * Goat Seller - Frontend
 * WARNING: Contains intentional security issues (XSS, etc.)
 */

const API_BASE = '';

// SECURITY: Hardcoded API key in client-side code (visible in browser/source)
const PUBLIC_API_KEY = 'pk_live_51ABC123def456GHI789jkl';
const ANALYTICS_ID = 'UA-12345678-9';
const INTERNAL_WEBHOOK_SECRET = 'whsec_do_not_commit_this';

// SECURITY ISSUE: XSS - inserting user-controlled content into DOM without sanitization
function renderGoats(goats) {
  const container = document.getElementById('goats-container');
  if (!goats || goats.length === 0) {
    container.innerHTML = '<p>No goats found.</p>';
    return;
  }
  container.innerHTML = goats.map(g => `
    <div class="goat-card" data-id="${g.id}">
      <h3>${g.name}</h3>
      <p><strong>Breed:</strong> ${g.breed}</p>
      <p class="price">$${g.price}</p>
      <p>${g.description || ''}</p>
      <button class="delete-goat" data-id="${g.id}">Delete</button>
    </div>
  `).join('');

  container.querySelectorAll('.delete-goat').forEach(btn => {
    btn.addEventListener('click', () => deleteGoat(btn.dataset.id));
  });
}

// SECURITY: Search results label uses innerHTML with search term - XSS
function showSearchResults(query, goats) {
  const el = document.getElementById('search-results-label');
  el.innerHTML = `Results for: <strong>${query}</strong> (${goats.length} found)`;
}

function loadGoats() {
  fetch(`${API_BASE}/api/goats/search?q=`)
    .then(r => r.json())
    .then(goats => renderGoats(goats))
    .catch(err => console.error(err));
}

function searchGoats() {
  const query = document.getElementById('search-input').value;
  // SECURITY: Query sent as-is to backend (SQL injection vector from frontend)
  fetch(`${API_BASE}/api/goats/search?q=${encodeURIComponent(query)}`)
    .then(r => r.json())
    .then(goats => {
      renderGoats(goats);
      showSearchResults(query, goats);
    })
    .catch(err => console.error(err));
}

function deleteGoat(id) {
  fetch(`${API_BASE}/api/goats/${id}`, { method: 'DELETE' })
    .then(r => r.json())
    .then(() => loadGoats())
    .catch(err => console.error(err));
}

document.getElementById('search-btn').addEventListener('click', searchGoats);
document.getElementById('search-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') searchGoats();
});

document.getElementById('add-goat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    breed: form.breed.value,
    price: parseFloat(form.price.value),
    description: form.description.value
  };
  fetch(`${API_BASE}/api/goats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(r => r.json())
    .then(() => {
      form.reset();
      loadGoats();
    })
    .catch(err => console.error(err));
});

// Login - SECURITY: password sent in body (no HTTPS assumed), credentials in form
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: form.username.value,
      password: form.password.value
    })
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline';
        document.getElementById('user-display').textContent = 'Logged in as ' + form.username.value;
      }
    });
});

document.getElementById('logout-btn').addEventListener('click', () => {
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  location.reload();
});

loadGoats();
