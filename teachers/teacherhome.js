// Fetch passes on page load
window.onload = function() {
    fetch('/students/viewpasses')
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Log the entire response to check for 'reason'
        
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows
        
        data.forEach(pass => {
            console.log(pass); // Log each pass object to verify `reason` exists
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pass.passID}</td>
                <td>${pass.student_det}</td>
                <td>${pass.pass_type}</td>
                <td>${new Date(pass.from_date).toLocaleString()}</td>
                <td>${new Date(pass.to_date).toLocaleString()}</td>
                <td>${pass.reason || 'No reason provided'}</td>
                <td class="actions">
                    <button class="tick" onclick="updateStatus(${pass.passID}, 'Approved')">&#10004;</button>
                    <button class="cross" onclick="updateStatus(${pass.passID}, 'Rejected')">&#10006;</button>
                </td>
                <td>
                    <textarea class="remark-box" id="remark-${pass.passID}" placeholder="Add remarks...">${pass.remark || ''}</textarea>
                    <button class="submit-btn" onclick="submitRemarks(${pass.passID})">Submit</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    });
};

// Update pass status
function updateStatus(passID, c_status) {
    const remarks = document.getElementById(`remark-${passID}`).value;
    fetch('/api/passes/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ passId: passID, c_status, remark: remarks })
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        // Update the row's status without reloading the page
        const row = document.querySelector(`tr:has(td:contains(${passID}))`);
        if (row) {
            row.cells[6].innerHTML = c_status; // Update the status cell
            // Disable buttons after action
            row.querySelector(`button.tick`).disabled = true;
            row.querySelector(`button.cross`).disabled = true;
        }
    });
}

// Submit remarks without changing status
function submitRemarks(passID) {
    const remarks = document.getElementById(`remark-${passID}`).value;
    fetch('/api/passes/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ passId: passID, c_status: '', remark: remarks })
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        // Update the row's remarks without reloading the page
        const row = document.querySelector(`tr:has(td:contains(${passID}))`);
        if (row) {
            row.cells[7].querySelector('.remark-box').value = remarks; // Update the remarks cell
        }
    });
}
app.post('/api/passes/update', (req, res) => {
    const { passId, c_status, remark } = req.body;
    
    // Build update query for both status and remark
    let updateQuery = 'UPDATE pass_requests SET ';
    const queryParams = [];

    if (c_status) {
        updateQuery += 'status = ?';
        queryParams.push(c_status);
    }
    
    if (remark) {
        if (c_status) updateQuery += ', ';  // Add a comma if status is also being updated
        updateQuery += 'remark = ?';
        queryParams.push(remark);
    }
    
    updateQuery += ' WHERE id = ?';
    queryParams.push(passId);
    
    db.query(updateQuery, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating pass');
        }
        res.send('Pass updated successfully');
    });
});

app.get('/students/viewpasses', (req, res) => {
    const query = `
        SELECT id as passID, student_det, pass_type, from_date, to_date, reason, remark 
        FROM pass_requests
        WHERE status = 'Pending'`; // Or adjust based on your needs

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching pass requests');
        }
        res.json(results);
    });
});
