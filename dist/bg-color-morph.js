//
// Change the background color based on scroll amount
// provide the starting color in rgb and the target color in rgb
// calculate how much should the color change ( the difference between starting color and target color )
// change color based on scroll ( start = 0, end = window height )
//

var colorSections = Array.prototype.slice.call( document.querySelectorAll('[data-color]') );
var backgroundColorArray = [];
var backgroundMask = document.querySelector("body");


var BackgroundColorController = function(elem, index, colorStart, colorEnd) {
  this.elem = elem;
  this.index = index;

  this.transitionRange = colorSections[index - 1].clientHeight;

  this.colorStart = colorStart;
  this.colorEnd = colorEnd;
  this.colorDif = {
    r: this.colorStart.r - this.colorEnd.r,
    g: this.colorStart.g - this.colorEnd.g,
    b: this.colorStart.b - this.colorEnd.b
  };

  this.colorTransition = {
    r: ( this.colorDif.r === 0 ) ? 0 : Math.floor( this.transitionRange / this.colorDif.r ),
    g: ( this.colorDif.g === 0 ) ? 0 : Math.floor( this.transitionRange / this.colorDif.g ),
    b: ( this.colorDif.b === 0 ) ? 0 : Math.floor( this.transitionRange / this.colorDif.b )
  };
};

BackgroundColorController.prototype.run = function() {
  var boundingRectY = this.elem.getBoundingClientRect().top;

  if( boundingRectY < this.transitionRange && boundingRectY > 0 ) {

    var changeForR = ( this.colorTransition.r === 0 ) ? 0 : Math.floor( (this.transitionRange - boundingRectY) / this.colorTransition.r ),
        changeForG = ( this.colorTransition.g === 0 ) ? 0 : Math.floor( (this.transitionRange - boundingRectY) / this.colorTransition.g ),
        changeForB = ( this.colorTransition.b === 0 ) ? 0 : Math.floor( (this.transitionRange - boundingRectY) / this.colorTransition.b );

    var r = this.colorStart.r - changeForR,
        g = this.colorStart.g - changeForG,
        b = this.colorStart.b - changeForB;

    var colorChangeString = "rgb(" + r + ", " + g + ", " + b + ")";

    backgroundMask.style.backgroundColor = colorChangeString;
  }
};

colorSections.forEach(function(elem, index) {
  if( index > 0 ) {
    var colorStart = getSectionColorCode( colorSections[index - 1] );
    var colorEnd = getSectionColorCode(colorSections[index]);
    backgroundColorArray.push( new BackgroundColorController(elem, index, colorStart, colorEnd ) );
  }
}, this);

function getSectionColorCode(sectionElem) {
  var colorString = sectionElem.getAttribute('data-color');
  var colorStringArray = colorString.split(',');
  var colorNums = [];

  colorStringArray.forEach(function(elem, index) {
    colorNums.push(parseInt(elem));
  }, this);

  return { r: colorNums[0], g: colorNums[1], b: colorNums[2] };
}

// handle scroll event
window.onscroll = function() {

  backgroundColorArray.forEach(function(elem, index) {
    elem.run();
  }, this);

};

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}