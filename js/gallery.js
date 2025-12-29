/**
 * Gallery Manager - Універсальний скрипт для галереї зображень
 * 
 * Використання:
 * <div class="gallery" 
 *      id="gallery" 
 *      data-folder="../images/ліжка" 
 *      data-total="73">
 * </div>
 */

class GalleryManager {
  constructor(options = {}) {
    this.gallery = document.getElementById(options.galleryId || 'gallery');
    if (!this.gallery) {
      console.error('Gallery element not found');
      return;
    }

    this.folder = this.gallery.dataset.folder;
    this.totalImages = parseInt(this.gallery.dataset.total, 10);
    this.batchSize = options.batchSize || 20;
    
    this.loadMoreContainer = document.getElementById(options.loadMoreContainerId || 'loadMoreContainer');
    this.imageCount = document.getElementById(options.imageCountId || 'imageCount');
    this.totalCount = document.getElementById(options.totalCountId || 'totalCount');
    
    this.lightbox = document.getElementById(options.lightboxId || 'lightbox');
    this.lightboxImg = document.getElementById(options.lightboxImgId || 'lightboxImg');
    this.lightboxClose = document.getElementById(options.lightboxCloseId || 'lightboxClose');
    this.lightboxPrev = document.getElementById(options.lightboxPrevId || 'lightboxPrev');
    this.lightboxNext = document.getElementById(options.lightboxNextId || 'lightboxNext');

    this.currentIndex = 1;
    this.currentLightboxIndex = 0;
    this.allImages = [];
    this.isLoading = false;
    this.allLoaded = false;

    this.init();
  }

  init() {
    this.updateTotalCount();
    this.attachEventListeners();
    this.loadImages();
  }

  attachEventListeners() {
    // Infinite scroll
    window.addEventListener('scroll', () => this.handleScroll());

    // Lightbox controls
    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }

    if (this.lightboxPrev) {
      this.lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showPrevImage();
      });
    }

    if (this.lightboxNext) {
      this.lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showNextImage();
      });
    }

    // Click outside to close
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.closeLightbox();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox || !this.lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.showPrevImage();
      if (e.key === 'ArrowRight') this.showNextImage();
    });
  }

  handleScroll() {
    if (this.isLoading || this.allLoaded) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    
    // Завантажуємо коли до кінця сторінки залишилось 300px
    if (scrollPosition >= pageHeight - 300) {
      this.loadImages();
    }
  }

  loadImages() {
    if (this.isLoading || this.allLoaded) return;
    
    this.isLoading = true;
    this.showLoader();

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.batchSize && this.currentIndex <= this.totalImages; i++, this.currentIndex++) {
      const item = this.createGalleryItem(this.currentIndex, i);
      fragment.appendChild(item);
    }

    // Симуляція затримки завантаження для показу анімації
    setTimeout(() => {
      this.gallery.appendChild(fragment);
      this.updateImageCount();
      this.hideLoader();
      this.isLoading = false;

      if (this.currentIndex > this.totalImages) {
        this.allLoaded = true;
      }
    }, 500);
  }

  createGalleryItem(index, animationIndex) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${animationIndex * 0.05}s`;

    const img = document.createElement('img');
    img.src = `${this.folder}/${index}.jpeg`;
    img.alt = `Зображення ${index}`;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    overlay.innerHTML = '<div class="gallery-zoom-icon">🔍</div>';

    item.appendChild(img);
    item.appendChild(overlay);

    const imageIndex = this.allImages.length;
    this.allImages.push(img.src);

    item.addEventListener('click', () => this.openLightbox(imageIndex));

    return item;
  }

  updateImageCount() {
    if (this.imageCount) {
      this.imageCount.textContent = this.allImages.length;
    }
  }

  updateTotalCount() {
    if (this.totalCount) {
      this.totalCount.textContent = this.totalImages;
    }
  }

  showLoader() {
    if (this.loadMoreContainer) {
      this.loadMoreContainer.classList.add('loading');
    }
  }

  hideLoader() {
    if (this.loadMoreContainer) {
      this.loadMoreContainer.classList.remove('loading');
    }
  }

  openLightbox(index) {
    if (!this.lightbox || !this.lightboxImg) return;

    this.currentLightboxIndex = index;
    this.lightboxImg.src = this.allImages[index];
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    if (!this.lightbox) return;

    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  showPrevImage() {
    if (!this.lightboxImg || this.allImages.length === 0) return;

    this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.allImages.length) % this.allImages.length;
    this.lightboxImg.src = this.allImages[this.currentLightboxIndex];
  }

  showNextImage() {
    if (!this.lightboxImg || this.allImages.length === 0) return;

    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.allImages.length;
    this.lightboxImg.src = this.allImages[this.currentLightboxIndex];
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GalleryManager();
});