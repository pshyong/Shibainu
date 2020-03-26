/* Get all elements with class="close" */
const closebtns = document.getElementsByClassName('close');

/* Loop through the elements, and hide the parent, when clicked on */
for (let i = 0; i < closebtns.length; i++) {
  closebtns[i].addEventListener('click', function() {
    this.parentElement.style.display = 'none';
  });
}
