import { api } from './api.js';
import { toast } from './utils.js';

const form = document.querySelector('[data-auth-form]');
if (form) form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = form.querySelector('button[type="submit"]');
  const error = form.querySelector('[data-form-error]');
  const values = Object.fromEntries(new FormData(form));
  error.classList.add('hidden');
  if (values.password.length < 8) return showError('Password must be at least 8 characters.');
  if (values.confirmPassword && values.password !== values.confirmPassword) return showError('Passwords do not match.');
  submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = 'Please wait…';
  try {
    const payload = form.dataset.mode === 'register' ? { name: values.name.trim(), email: values.email.trim(), password: values.password } : { email: values.email.trim(), password: values.password };
    await api[form.dataset.mode](payload);
    window.location.assign('/index.html');
  } catch (err) { showError(err.message); toast(err.message, 'error'); }
  finally { submit.disabled = false; submit.textContent = submit.dataset.label; }
  function showError(message) { error.textContent = message; error.classList.remove('hidden'); }
});
