import React, { useRef, useEffect } from "react";
import {select,flatRollup,sum,scaleLinear,axisBottom,axisLeft,line,curveMonotoneX } from 'd3'
import {useResizeObserver} from '../utils/customHooks'

function LineChart({ data,name }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
  
    if (!dimensions) return; 
    svg
    .attr("width", dimensions.width )
    .attr("height", dimensions.height )
    .append("g")


    let sumstat = flatRollup(data, 
      v => {
        return {
          intensity: sum(v,v =>v.intensity),
          likelihood: sum(v,v=>v.likelihood),
          relevance: sum(v,v=>v.relevance)
        } 
      },
      d => {return new Date(d.published).getFullYear()},
    )

    console.table(sumstat);

    var xScale = scaleLinear().domain([2007,2020]).range([0, dimensions.width - 100]);
    var yScale = scaleLinear().domain([0, 10000]).range([dimensions.height -40  , 0]);

    svg.append("g")
         .attr("transform", "translate(40," + (dimensions.height -20) + ")")
         .call(axisBottom(xScale))
         .selectAll("text")
        .attr("transform", "translate(0,-6)rotate(-35)")
        .style("text-anchor", "end");
        
    svg.append("g")
      .attr("transform", "translate(" + 40 + ",20)")
      .call(axisLeft(yScale));

    svg.append('g')
    .selectAll("dot")
    .data(sumstat)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1].intensity || 0); } )
    .attr("r", 2)
    .attr("transform", "translate(" + 40 + "," + 20 + ")")
    .style("fill", "#CC0000");
    

    var line1 = line()
        .x(function(d) { return xScale(d[0]); }) 
        .y(function(d) { return yScale(d[1].intensity); }) 
        .curve(curveMonotoneX)
        
    svg.append("path")
    .datum(sumstat) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 40+ "," + 20 + ")")
    .attr("d", line1)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "2")

    svg.append('g')
    .selectAll("dot")
    .data(sumstat)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1].likelihood || 0); } )
    .attr("r", 2)
    .attr("transform", "translate(" + 40 + "," + 20 + ")")
    .style("fill", "green");
    

    var line2 = line()
        .x(function(d) { return xScale(d[0]); }) 
        .y(function(d) { return yScale(d[1].likelihood); }) 
        .curve(curveMonotoneX)
        
    svg.append("path")
    .datum(sumstat) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 40+ "," + 20 + ")")
    .attr("d", line2)
    .style("fill", "none")
    .style("stroke", "green")
    .style("stroke-width", "2")

    svg.append('g')
    .selectAll("dot")
    .data(sumstat)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1].relevance || 0); } )
    .attr("r", 2)
    .attr("transform", "translate(" + 40 + "," + 20 + ")")
    .style("fill", "blue");
    

    var line3 = line()
        .x(function(d) { return xScale(d[0]); }) 
        .y(function(d) { return yScale(d[1].relevance); }) 
        .curve(curveMonotoneX)
        
    svg.append("path")
    .datum(sumstat) 
    .attr("class", "line") 
    .attr("transform", "translate(" + 40+ "," + 20 + ")")
    .attr("d", line3)
    .style("fill", "none")
    .style("stroke", "blue")
    .style("stroke-width", "2")

    svg.append("circle").attr("cx",dimensions.width - 100).attr("cy",30).attr("r", 6).style("fill", "#CC0000")
    svg.append("circle").attr("cx",dimensions.width - 100).attr("cy",50).attr("r", 6).style("fill", "blue")
    svg.append("circle").attr("cx",dimensions.width - 100).attr("cy",70).attr("r", 6).style("fill", "green")
    svg.append("text").attr("x", dimensions.width - 80).attr("y", 30).text("intensity").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", dimensions.width - 80).attr("y", 50).text("relevance").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", dimensions.width - 80).attr("y", 70).text("likelihood").style("font-size", "15px").attr("alignment-baseline","middle")
    
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ gridArea: name,paddingBottom: '20px',backgroundColor: 'white'}}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default LineChart;