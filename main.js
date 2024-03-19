const clientId = '3bv4cN2whQeGko8DqVKEYoTu8js9pjPpDqMyFLd3';
const clientSecret = 'QBrRAFdo75STsmjXmGdfRqMMZT9Bi0fAIMTDXOXn7VneRkAoOmi8Z8tlz3bgXmsDUbrGSNSwNxbU1ZJbqxroXpXo78OYpKW3dWZXKBmLJRnbT5ZahTSzSBX9bLvKsigo';
const priceFilter = 'price=price-free'; // Change 'price-free' to 'price-paid' for paid courses

// Base64 encode the client ID and client secret
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

// Endpoint URL for fetching course data
const apiUrl = 'https://www.udemy.com/api-2.0/courses/';

// Function to fetch courses from a specific page
async function fetchCourses(page) {
  const response = await fetch(`${apiUrl}?page=${page}&${priceFilter}`, {
    headers: {
      'Authorization': `Basic ${encodedCredentials}`
    },
    
    clientId:`${clientId}`,
    clientSecret:`${clientSecret}`
  });
  if (!response.ok) {
    throw new Error('Failed to fetch course data');
  }
  return response.json();
}

// Function to fetch all courses recursively from all pages
async function fetchAllCourses() {
  let allCourses = [];
  let currentPage = 1;
  let totalPages = Infinity; // Initially set to infinity to start the loop

  while (currentPage <= totalPages) {
    const { results, total_pages } = await fetchCourses(currentPage);
    allCourses = [...allCourses, ...results];
    totalPages = total_pages;
    currentPage++;
  }

  return allCourses;
}

// Fetch all courses and filter them by price
fetchAllCourses()
  .then(courses => {
    // Filter courses based on price
    const filteredCourses = courses.filter(course => course.price === 'price-free');

    // Create table HTML
    const table = document.createElement('table');
    table.border = '1';

    // Create table header
    const headerRow = table.insertRow();
    const headers = ['Course ID', 'Title', 'URL'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      const text = document.createTextNode(headerText);
      th.appendChild(text);
      headerRow.appendChild(th);
    });

    // Add course data to table rows
    filteredCourses.forEach(course => {
      const row = table.insertRow();
      const courseIdCell = row.insertCell();
      const titleCell = row.insertCell();
      const urlCell = row.insertCell();

      courseIdCell.appendChild(document.createTextNode(course.id));
      titleCell.appendChild(document.createTextNode(course.title));
      urlCell.appendChild(document.createTextNode(course.url));
    });

    // Append table to container in HTML
    document.getElementById('courseTableContainer').appendChild(table);
  })
  .catch(error => {
    // Log any errors that occurred during fetch
    console.error('Error fetching course data:', error);
  });
