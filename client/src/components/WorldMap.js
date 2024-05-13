import React, { useRef, useEffect } from "react";
import {select,selectAll,geoPath,geoMercator,scaleThreshold,schemeBlues,pointer,json} from 'd3'
import {useResizeObserver} from '../utils/customHooks'

function WorldMap({ data,name }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
  
    if (!dimensions) return; 
    svg
    .attr("width", dimensions.width)
    .attr("height", dimensions.height - 20)
    
    var projection = geoMercator()
    .scale(70)
    .center([0,20])
    .translate([dimensions.width / 2, dimensions.height / 2]);

    var mapData1 = new Map();
    var mapData2 = new Map();
    var mapData3 = new Map();
    data.forEach(d => {mapData1.set(d.country,+d.intensity);mapData2.set(d.country,+d.likelihood);mapData3.set(d.country,+d.relevance)})
    var colorScale = scaleThreshold()
      .domain([1,5,10,15,20,25])
      .range(schemeBlues[7]);

      var tooltip = select(wrapperRef.current)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position","absolute")
      // .style("position","fixed")
      
  
      var showTooltip = function(e,d) {
        tooltip
          .transition()
          .duration(100)
          .style("opacity", 1)
        tooltip
          .html( "Country: " + d.properties.name + "<br/>Intensity:" + d.total + "<br/>Likelihood:" + d.likelihood
            + "<br/>Relevance:" + d.relevance
          )
          .style("left", (pointer(e,svg)[0] + 20) + "px")
          .style("top", (pointer(e,svg)[1]) + "px")

      }
      var moveTooltip = function(e,d) {
        tooltip
        .style("left", (pointer(e,svg)[0]+20) + "px")
        .style("top", (pointer(e,svg)[1]) + "px")
      }
      var hideTooltip = function(e) {
        tooltip
          .transition()
          .duration(100)
          .style("opacity", 0)
      }


  json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .then(ready)

  function ready(topo) {

    let mouseOver = function(e,d) {

      selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
        showTooltip(e,d)
    }

    let mouseLeave = function(e,d) {
      selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
        hideTooltip(e,d)
    }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.properties.name = (d.properties.name === 'USA')? 'United States of America' : d.properties.name;
        d.total = mapData1.get(d.properties.name) || 0;
        d.likelihood = mapData2.get(d.properties.name) || 0;
        d.relevance = mapData3.get(d.properties.name) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("mousemove", moveTooltip )
    }

  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ gridArea: name,paddingBottom: '20px',backgroundColor: 'white' }}>
      <h1 className="title" >Color highlighted based on intensity,hover to see more details</h1>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default WorldMap;