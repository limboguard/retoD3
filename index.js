const URL1 =
  "https://gist.githubusercontent.com/josejbocanegra/d3b9e9775ec3a646603f49bc8d3fb90f/raw/3a39300c2a2ff8644a52e22228e900251ec5880a/population.json";
const URL2 =
  "https://gist.githubusercontent.com/josejbocanegra/000e838b77c6ec8e5d5792229c1cdbd0/raw/83cd9161e28e308ef8c5363e217bad2b6166f21a/countries.json";

const width = 700;
const height = 500;
const margin = { top: 10, left: 50, bottom: 40, right: 10 };
const iwidth = width - margin.left - margin.right;
const iheight = height - margin.top - margin.bottom;

function getData1() {
  d3.json(URL1).then((data) => {
    paintHorizontalBarChart(data.sort((a, b) => +a.value - +b.value));
  });
}

function getData2() {
  d3.json(URL2).then((data) => {
    paintBubblePlot(data);
  });
}

function paintHorizontalBarChart(data) {
  const svg = d3
    .select("#canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d.value))])
    .range([0, iwidth]);

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([iheight, 0])
    .padding(0.1);

  const bars = g.selectAll("rect").data(data);

  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .style("fill", "steelblue")
    .attr("x", 0)
    .attr("y", (d) => y(d.name))
    .attr("height", y.bandwidth())
    .attr("width", (d) => x(d.value));

  g.append("g")
    .classed("x--axis", true)
    .call(d3.axisBottom(x))
    .attr("transform", `translate(0, ${iheight})`);

  g.append("g").classed("y--axis", true).call(d3.axisLeft(y));
}

function paintBubblePlot(data) {
  const svg = d3
    .select("#canvas2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([
      d3.min(data.map((d) => +d.purchasingpower)) * 0.8,
      d3.max(data.map((d) => +d.purchasingpower)) * 1.2,
    ])
    .range([0, iwidth]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${iheight})`)
    .call(d3.axisBottom(x));

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(data.map((d) => +d.lifeexpectancy)) * 0.8,
      d3.max(data.map((d) => +d.lifeexpectancy)) * 1.2,
    ])
    .range([iheight, 0]);
  svg.append("g").call(d3.axisLeft(y));

  const z = d3
    .scaleLinear()
    .domain([
      d3.min(data.map((d) => +d.population)),
      d3.max(data.map((d) => +d.population)),
    ])
    .range([10, 40]);

  const tooltip = d3
    .select("#canvas2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

  const showTooltip = (event, d) => {
    tooltip.transition().duration(200);
    tooltip
      .style("opacity", 1)
      .html("Country: " + d.country)
      .style("left", event.pageX + 30 + "px")
      .style("top", event.pageY + 30 + "px");
  };
  const moveTooltip = (event, d) => {
    tooltip
      .style("left", event.pageX + 30 + "px")
      .style("top", event.pageY + 30 + "px");
  };
  const hideTooltip = (event, d) => {
    tooltip.transition().duration(200).style("opacity", 0);
  };

  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(+d.purchasingpower))
    .attr("cy", (d) => y(+d.lifeexpectancy))
    .attr("r", (d) => z(+d.population))
    .style("fill", "#69b3a2")
    .style("opacity", "0.7")
    .attr("stroke", "black")
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);
}

getData1();
getData2();
