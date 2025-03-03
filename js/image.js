new Vue({
    el: '#app',
    components: {
      VueGallerySlideshow
    },
    methods: {
      onClick(i) {
        this.index = i;
        this.showSlideshow = true;
      },
      closeSlideshow() {
        this.showSlideshow = false; // Hide the slideshow
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
      index: 0,
      showSlideshow: false
    }
  })