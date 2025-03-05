import VueGallerySlideshow from 'vue-gallery-slideshow'
const app = new Vue({
  el: '#app',
  components: {
    VueGallerySlideshow
  },
  methods: {
    onClick(i) {
      this.index = i;
    }
  },
  data: {
      images: [
        "images/gong.jpg",
        'images/Sakamoto.jpg',
        'images/bp.jpg',
        'images/Manga.jpg',
        'images/pirates.jpg',
        'https://preview.redd.it/new-wallpaper-for-my-pc-they-have-no-right-being-this-cool-v0-3l2k9lpytrcc1.jpeg?auto=webp&s=84fbc9925af40466495e023248afa37305b232fd',
        'images/Chman.jpg',
        "images/fish.jpg"
      ],
      index: 0
    }
  })