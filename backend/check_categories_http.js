
import http from 'http';

http.get('http://localhost:5000/api/categories', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        const categories = JSON.parse(data);
        const names = categories.map(c => c.name);
        console.log(JSON.stringify(names, null, 2));

        if (names.includes('Food & Drink')) {
            console.log("❌ 'Food & Drink' still exists!");
        } else {
            console.log("✅ 'Food & Drink' is GONE.");
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
