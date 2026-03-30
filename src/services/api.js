const BASE_URL = 'http://localhost:5000/api';

// ─── AUTH ──────────────────────────────────────────────────

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const registerUser = async ({ name, email, password, role }) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

// ─── DASHBOARD ─────────────────────────────────────────────

export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
};

// ─── BOOKS ─────────────────────────────────────────────────

export const getBooks = async () => {
  const res = await fetch(`${BASE_URL}/books`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
};

export const addBook = async (book) => {
  const res = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add book');
  return data;
};

export const deleteBook = async (bookId) => {
  const res = await fetch(`${BASE_URL}/books/${bookId}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete book');
  return data;
};

// ─── ISSUE / RETURN ────────────────────────────────────────

export const issueBook = async (issueData) => {
  const res = await fetch(`${BASE_URL}/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issueData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to issue book');
  return data;
};

export const returnBook = async (issueId) => {
  const res = await fetch(`${BASE_URL}/return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issue_id: issueId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to return book');
  return data;
};

export const getIssuedBooks = async () => {
  const res = await fetch(`${BASE_URL}/issued`);
  if (!res.ok) throw new Error('Failed to fetch issued books');
  return res.json();
};