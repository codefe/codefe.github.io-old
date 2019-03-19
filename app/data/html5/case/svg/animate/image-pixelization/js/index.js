var composite = document.querySelector('#composite');
var morphology = document.querySelector('#morphology');
var image = document.querySelector('#image');

var min = 2;
var max = 20;
var counter = min;
var step = 4;
var direction = 'forward';
var imagesCounter = 0;
var pausa = 2; // seconds

var images = [
'images/2403141_original.jpg',
'images/2404025_original.jpg',
'images/2415467_original.jpg',
'images/2450837_original.jpg',
'images/2454600_original.jpg',
'images/2454000_original.jpg'];


function changeSeed() {
  if (counter <= min) {
    image.setAttribute('filter', 'url(#pixels)');
  }

  if (direction === 'forward') {
    counter += step;

    if (counter >= max) {
      direction = 'backward';
      image.setAttribute('xlink:href', images[imagesCounter]);
      imagesCounter++;

      if (imagesCounter === images.length) {
        imagesCounter = 0;
      }
    }
  } else
  {
    counter -= step;

    if (counter <= min) {
      direction = 'forward';
    }
  }
  composite.setAttribute('width', counter);
  composite.setAttribute('height', counter);
  morphology.setAttribute('radius', Math.ceil(counter / 1.95));
  colormatrix.setAttribute('values', 1 - counter / max);

  var time = 75;

  if (counter <= min) {
    time = pausa * 1000;
    image.setAttribute('filter', 'none');
  }

  setTimeout(changeSeed, time);
}

window.requestAnimationFrame(changeSeed);
      //# sourceURL=pen.js