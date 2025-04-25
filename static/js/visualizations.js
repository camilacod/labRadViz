// Configuración inicial
const width = document.getElementById('visualization').clientWidth - 40;
const height = document.getElementById('visualization').clientHeight - 40;
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Seleccionar el div de visualización
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Crear tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Variable para almacenar los datos obtenidos
let data;

// Función para cargar los datos desde la API
async function loadData() {
    try {
        const response = await fetch('/api/data');
        data = await response.json();
        // Por defecto, mostrar el gráfico de dispersión
        createScatterPlot();
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// Función para crear un gráfico de dispersión
function createScatterPlot() {
    // Limpiar el SVG
    svg.selectAll("*").remove();

    // Escalas
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x)])
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y)])
        .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(['A', 'B', 'C'])
        .range(d3.schemeCategory10);

    // Ejes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Añadir ejes
    svg.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    // Etiquetas de los ejes
    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Valor X");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -innerHeight / 2)
        .attr("text-anchor", "middle")
        .text("Valor Y");

    // Puntos
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 6)
        .attr("fill", d => colorScale(d.categoria))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`ID: ${d.id}<br>X: ${d.x}<br>Y: ${d.y}<br>Categoría: ${d.categoria}<br>Valor: ${d.valor.toFixed(2)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr("r", 8);
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this).attr("r", 6);
        });

    // Leyenda
    const legend = svg.append("g")
        .attr("transform", `translate(${innerWidth - 120}, 0)`);

    ['A', 'B', 'C'].forEach((category, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);
        
        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(category));
        
        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text(category);
    });
}

// Función para crear un gráfico de barras
function createBarChart() {
    // Limpiar el SVG
    svg.selectAll("*").remove();

    // Agrupar datos por categoría
    const groupedData = d3.rollup(
        data,
        v => d3.mean(v, d => d.valor),
        d => d.categoria
    );

    // Convertir a array para D3
    const barData = Array.from(groupedData, ([categoria, valor]) => ({ categoria, valor }));

    // Escalas
    const xScale = d3.scaleBand()
        .domain(barData.map(d => d.categoria))
        .range([0, innerWidth])
        .padding(0.2);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.valor)])
        .range([innerHeight, 0]);
    
    const colorScale = d3.scaleOrdinal()
        .domain(['A', 'B', 'C'])
        .range(d3.schemeCategory10);

    // Ejes
    svg.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));
    
    svg.append("g")
        .call(d3.axisLeft(yScale));
    
    // Barras
    svg.selectAll(".bar")
        .data(barData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.categoria))
        .attr("y", d => yScale(d.valor))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.valor))
        .attr("fill", d => colorScale(d.categoria))
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Categoría: ${d.categoria}<br>Valor Promedio: ${d.valor.toFixed(2)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this)
                .attr("stroke", "#333")
                .attr("stroke-width", 2);
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this)
                .attr("stroke", "none");
        });

    // Etiquetas de los ejes
    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Categoría");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -innerHeight / 2)
        .attr("text-anchor", "middle")
        .text("Valor Promedio");
}

// Event listeners para los botones
document.getElementById("scatterplot").addEventListener("click", createScatterPlot);
document.getElementById("barchart").addEventListener("click", createBarChart);

// Cargar datos cuando se cargue la página
document.addEventListener("DOMContentLoaded", loadData); 