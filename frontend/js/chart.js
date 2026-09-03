// ========================================================
// MODULE: chart.js - Biểu đồ Xu hướng Nhiệt độ & Lượng mưa (Chart.js)
// ========================================================

let trendChartInstance = null;

function renderWeatherTrendChart(hourly, hoursCount = 24, unit = 'C') {
  const canvas = document.getElementById('weatherTrendChart');
  if (!canvas || typeof Chart === 'undefined' || !hourly || !hourly.time) return;

  const now = new Date();
  const currentHourStr = now.toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex(t => t.startsWith(currentHourStr));
  if (startIndex === -1) startIndex = 0;

  const labels = [];
  const temps = [];
  const pops = [];

  for (let i = startIndex; i < startIndex + hoursCount && i < hourly.time.length; i++) {
    const timeStr = hourly.time[i];
    const hour = timeStr.split('T')[1].slice(0, 5);
    labels.push(i === startIndex ? 'Hiện tại' : hour);
    temps.push(Math.round(formatTemp(hourly.temperature_2m[i], unit)));
    pops.push(hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0);
  }

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  const tempGradient = ctx.createLinearGradient(0, 0, 0, 220);
  tempGradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  tempGradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: `Nhiệt độ (°${unit})`,
          data: temps,
          borderColor: '#38bdf8',
          backgroundColor: tempGradient,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ffffff',
          yAxisID: 'yTemp',
        },
        {
          label: 'Xác suất mưa (%)',
          data: pops,
          type: 'bar',
          backgroundColor: 'rgba(96, 165, 250, 0.45)',
          borderRadius: 4,
          yAxisID: 'yPop',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { family: 'Plus Jakarta Sans', size: 12 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
          padding: 10,
          cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.06)' },
          ticks: { color: 'rgba(255, 255, 255, 0.65)', font: { size: 11 }, maxRotation: 0 }
        },
        yTemp: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          ticks: { color: '#38bdf8', callback: v => `${v}°` }
        },
        yPop: {
          type: 'linear',
          position: 'right',
          min: 0,
          max: 100,
          grid: { display: false },
          ticks: { color: '#60a5fa', callback: v => `${v}%` }
        }
      }
    }
  });
}
