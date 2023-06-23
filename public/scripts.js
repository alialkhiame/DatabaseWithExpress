// JavaScript code to zoom in and out
 
document.addEventListener('DOMContentLoaded', () => {
    const hideTableButton = document.getElementById('hideTableButton');
    const showTableButton = document.getElementById('show');
    const table = document.getElementById('tier');
    const s = document.getElementById('s');
    hideTableButton.addEventListener('click', () => {
        table.style.display = 'none';
         
         
    });
    showTableButton.addEventListener('click', () => {
        table.style.display = 'block';
         

    });


  });


  function formatDate(date) {
    // Date formatting logic here
    // ...
    return formattedDate;
  }
  
  module.exports = {
    formatDate,
  };
 