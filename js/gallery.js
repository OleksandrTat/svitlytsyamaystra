document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  const folder = gallery.dataset.folder;
  const total = +gallery.dataset.total;
  const loadMore = document.querySelector('.load-more');
  const counter = document.getElementById('imageCount');

  let index = 1;
  const batch = 20;
  const images = [];

  function load() {
    for (let i = 0; i < batch && index <= total; i++, index++) {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      const img = document.createElement('img');
      img.src = `${folder}/${index}.jpeg`;
      img.loading = 'lazy';

      item.appendChild(img);
      gallery.appendChild(item);

      images.push(img.src);
    }

    counter.textContent = images.length;
    if (index > total) loadMore.remove();
  }

  loadMore?.addEventListener('click', load);
  load();
});
