// ===== fetch =====
fetch('/now').then(function (response) {
    if (response.ok) {
        return response.text();
    }
    else {
        throw ('Connection error');
    }

})
    .then(function (data) {
        // console.log(data);
        document.querySelector('h1').innerText = data;
    })
    .catch(function (err) {
        console.log(err);
        alert(err);
    })

// ====  fetch try =====
try {
    const response = await fetch('/now');
    if (response.ok) {
        const data = await response.text();
        document.querySelector('h1').innerText = data;
    }
    else {
        throw ('Connection error');
    }
} catch (err) {
    console.log(err);
    alert(err.message);
}