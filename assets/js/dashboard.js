  $(document).ready(function(){
    $('.counter-value').each(function(){
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        },{
            duration: 3500,
            easing: 'swing',
            step: function (now){
                $(this).text(Math.ceil(now));
            }
        });
    });
});

    // Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Yield (kg)',
                data: [100, 150, 200, 180, 220],
                borderColor: '#4bc0c0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Yield (kg)'
                    }
                }
            }
        }
    });

    // Bar Chart
    const barCtx2 = document.getElementById('barChart2').getContext('2d');
    new Chart(barCtx2, {
        type: 'bar',
        data: {
            labels: ['Field 1', 'Field 2', 'Field 3', 'Field 4'],
            datasets: [{
                label: 'Performance Score',
                data: [75, 90, 80, 95],
                backgroundColor: ['#E195AB', '#80C4E9', '#86D293', '#4bc0c0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Pie Chart
    const pieCtx2 = document.getElementById('pieChart2').getContext('2d');
    new Chart(pieCtx2, {
        type: 'pie',
        data: {
            labels: ['Fertilizers', 'Pesticides', 'Water'],
            datasets: [{
                data: [40, 30, 30],
                backgroundColor: ['#B1F0F7', '#36a2eb', '#E195AB']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });

  document.addEventListener('DOMContentLoaded', function () {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    document.getElementById('current-date').textContent = currentDate;
  });
