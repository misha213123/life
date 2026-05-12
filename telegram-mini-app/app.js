const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const servicesData = [
  { id: 'haircut', name: 'Стрижка', price: 1500, duration: '45 мин' },
  { id: 'beard', name: 'Борода', price: 1000, duration: '30 мин' },
  { id: 'combo', name: 'Комплекс', price: 2200, duration: '75 мин' },
  { id: 'kids', name: 'Детская стрижка', price: 1200, duration: '40 мин' }
];

const barbersData = [
  { id: 'alex', name: 'Алексей', level: 'TOP barber' },
  { id: 'timur', name: 'Тимур', level: 'Senior' },
  { id: 'ilya', name: 'Илья', level: 'Middle' }
];

const timeSlots = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
const state = { service: null, barber: null, time: null };

const servicesEl = document.getElementById('services');
const barbersEl = document.getElementById('barbers');
const timesEl = document.getElementById('times');
const statusEl = document.getElementById('status');

document.getElementById('date').valueAsDate = new Date();

function renderChips(data, root, key, template) {
  root.innerHTML = data.map(template).join('');
  root.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-id]');
    if (!chip) return;
    state[key] = chip.dataset.id;
    [...root.querySelectorAll('.chip')].forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
  });
}

renderChips(
  servicesData,
  servicesEl,
  'service',
  (item) => `<button class="chip" data-id="${item.id}"><b>${item.name}</b><br>${item.price} ₽ · ${item.duration}</button>`
);

renderChips(
  barbersData,
  barbersEl,
  'barber',
  (item) => `<button class="chip" data-id="${item.id}"><b>${item.name}</b><br>${item.level}</button>`
);

timesEl.innerHTML = timeSlots.map((t) => `<button class="time-slot" data-time="${t}">${t}</button>`).join('');
timesEl.addEventListener('click', (e) => {
  const slot = e.target.closest('[data-time]');
  if (!slot) return;
  state.time = slot.dataset.time;
  [...timesEl.querySelectorAll('.time-slot')].forEach((item) => item.classList.remove('active'));
  slot.classList.add('active');
});

function validate() {
  const date = document.getElementById('date').value;
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  return state.service && state.barber && state.time && date && name && phone;
}

document.getElementById('book').addEventListener('click', () => {
  if (!validate()) {
    statusEl.textContent = 'Заполните все обязательные поля';
    return;
  }

  const payload = {
    service: servicesData.find((s) => s.id === state.service),
    barber: barbersData.find((b) => b.id === state.barber),
    date: document.getElementById('date').value,
    time: state.time,
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    comment: document.getElementById('comment').value.trim(),
    user: tg?.initDataUnsafe?.user || null,
    createdAt: new Date().toISOString()
  };

  if (tg) {
    tg.sendData(JSON.stringify(payload));
    tg.HapticFeedback?.notificationOccurred('success');
    tg.close();
  } else {
    statusEl.textContent = 'Локальный режим: данные готовы к отправке в бота';
    console.log(payload);
  }
});
