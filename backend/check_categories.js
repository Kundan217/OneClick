
import fetch from 'node-fetch';

async function checkCategories() {
    try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCategories();
