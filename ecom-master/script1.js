// Accordion Functionality
const accordionButtons = document.querySelectorAll('.accordion-button');

accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const isOpen = content.style.display === 'block';

        // Close all sections
        document.querySelectorAll('.accordion-content').forEach(item => {
            item.style.display = 'none';
        });

        // Open the clicked section if it was closed
        if (!isOpen) {
            content.style.display = 'block';
        }
    });
});
