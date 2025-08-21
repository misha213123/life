// Загрузка контента из /data
const state = {
  stories: [],
  friends: [],
  filter: ''
};

const el = (sel) => document.querySelector(sel);

async function loadJSON(path){
  const res = await fetch(path, {cache:'no-store'});
  if(!res.ok){ throw new Error('Не удалось загрузить ' + path); }
  return res.json();
}

function formatDate(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', {year:'numeric', month:'long', day:'numeric'});
  }catch(e){ return iso; }
}

function storyCard(s){
  const tags = (s.tags||[]).map(t=>`<span class="tag">#${t}</span>`).join(' ');
  const images = (s.images||[]).map(name => `<img src="assets/${name}" alt="">`).join('');
  return `<article class="card">
    <div class="meta">
      <span>📅 ${formatDate(s.date)}</span>
      <span>•</span>
      <span>🕮 ${s.mood || '—'}</span>
    </div>
    <h4>${s.title}</h4>
    <p>${s.text}</p>
    <div>${tags}</div>
    <div class="images">${images}</div>
  </article>`;
}

function friendCard(f){
  const avatar = f.avatar ? `<img class="avatar" src="assets/${f.avatar}" alt="">` : '';
  const socials = f.link ? `<div><a href="${f.link}" target="_blank" rel="noreferrer">ссылка</a></div>` : '';
  return `<div class="friend">
    ${avatar}
    <div class="name">👤 ${f.name}${f.nickname ? ' — ' + f.nickname : ''}</div>
    <div class="quote">“${f.quote || ''}”</div>
    <div class="bio">${f.memory || ''}</div>
    ${socials}
  </div>`;
}

function render(){
  // Timeline
  const q = state.filter.toLowerCase().trim();
  const filtered = state.stories.filter(s => {
    const hay = [s.title, s.text, ...(s.tags||[])].join(' ').toLowerCase();
    return hay.includes(q);
  });
  el('#timelineList').innerHTML = filtered.map(storyCard).join('');
  el('#noResults').style.display = filtered.length ? 'none' : 'block';

  // Friends
  el('#friendsGrid').innerHTML = state.friends.map(friendCard).join('');

  // Gallery (из всех картинок историй)
  const imgs = state.stories.flatMap(s => s.images||[]);
  const uniq = [...new Set(imgs)];
  el('#galleryGrid').innerHTML = uniq.map(name => `<img src="assets/${name}" alt="">`).join('');
}

function bind(){
  el('#search').addEventListener('input', (e)=>{
    state.filter = e.target.value;
    render();
  });
  el('#addEntryBtn').addEventListener('click', ()=>{
    alert(`Как добавить историю:
1) Открой файл data/stories.json
2) Добавь объект в массив "stories", например:
{
  "date": "2025-08-21",
  "title": "Название",
  "text": "Короткий текст воспоминания",
  "tags": ["улица","друзья"],
  "images": ["img001.jpg"],
  "mood": "спокойствие"
}
3) Зафиксируй изменения (commit) и запушь (push).`);
  });
}

async function init(){
  try{
    const [stories, friends] = await Promise.all([
      loadJSON('data/stories.json'),
      loadJSON('data/friends.json'),
    ]);
    state.stories = stories.stories || [];
    state.friends = friends.friends || [];
    render();
    bind();
  }catch(err){
    console.error(err);
    el('#timelineList').innerHTML = '<p class="muted">Не удалось загрузить данные. Проверь файлы в папке data/</p>';
  }
}

init();
