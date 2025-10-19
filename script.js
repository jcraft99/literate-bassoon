// Preview images
const input = document.getElementById('imageUpload');
const preview = document.getElementById('preview');

input.addEventListener('change', () => {
  preview.innerHTML = '';
  const files = input.files;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '150px';
      img.style.margin = '5px';
      img.style.borderRadius = '8px';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// Form submission
const form = document.getElementById('contactForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Your request has been submitted successfully! I’ll contact you soon.');
      form.reset();
      preview.innerHTML = '';
    } else {
      alert('There was an issue submitting your request. Please try again.');
    }
  } catch (error) {
    alert('Error connecting to server. Please try again later.');
    console.error(error);
  }
});
