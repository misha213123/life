# Патч к app.js
Добавь в `init()` дополнительную загрузку `data/submissions.json` и объединение с историями только `approved: true`:
```js
const [stories, friends, submissions] = await Promise.all([
  loadJSON('data/stories.json'),
  loadJSON('data/friends.json'),
  loadJSON('data/submissions.json'),
]);
state.stories = [...(stories.stories||[]), ...((submissions.submissions||[]).filter(x=>x.approved))];
```
(остальной код без изменений)
