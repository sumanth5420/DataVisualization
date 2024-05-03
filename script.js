document.addEventListener('DOMContentLoaded', function () {
    const bloodTypeChart = document.getElementById('bloodTypeChart').getContext('2d');
    let bloodData = [];

    fetch('https://random-data-api.com/api/v2/blood_types?size=100&response_type=json')
        .then(response => response.json())
        .then(data => {
            bloodData = data;

            const types = [...new Set(data.map(entry => entry.type))];
            const groups = [...new Set(data.map(entry => entry.group))];

            const typeSelect = document.getElementById('type-select');
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelect.appendChild(option);
            });

            const groupSelect = document.getElementById('group-select');
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group;
                option.textContent = group;
                groupSelect.appendChild(option);
            });

            renderChart();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function renderChart() {
        const selectedType = document.getElementById('type-select').value;
        const selectedGroup = document.getElementById('group-select').value;

        const filteredData = bloodData.filter(entry =>
            (selectedType === 'All' || entry.type === selectedType) &&
            (selectedGroup === 'All' || entry.group === selectedGroup)
        );

        const counts = {};
        filteredData.forEach(entry => {
            counts[entry.blood_type] = (counts[entry.blood_type] || 0) + 1;
        });

        const labels = Object.keys(counts);
        const values = Object.values(counts);

        if (window.bloodChart) {
            window.bloodChart.destroy();
        }

        window.bloodChart = new Chart(bloodTypeChart, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Blood Type Counts',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    document.getElementById('type-select').addEventListener('change', renderChart);
    document.getElementById('group-select').addEventListener('change', renderChart);
});