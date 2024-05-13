import { useState,useRef, useEffect } from "react";
import * as d3 from 'd3';
import {useD3}from '../utils/customHooks'

function FiltersMenu({ data,showOrHide,addFilters,hideFiltersMenu }) {
   const sideNav = useRef();
   useEffect(() => {
    if(showOrHide) sideNav.current.classList.add('open');
    else sideNav.current.classList.remove('open');
   },[showOrHide])
   const [values, setValues] = useState({
        start_year: '',
        end_year: '',
        topic: [],
        sector: [],
        region: [],
        country: [],
        source: []
    });
  const handleInputChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })        
    }
  const handleFilterForm = (e) => {
        e.preventDefault();
        addFilters(values)
        setValues({
            start_year: '',
            end_year: '',
            topic: [],
            sector: [],
            region: [],
            country: [],
            source: []
        })   
    }
  const handleCheckBoxInput = (d,i) => {
      let arr = values[d.target.name]
      if(d.target.checked){
        arr.push(d.target.value)
        setValues({
            ...values,
            [d.target.name]: arr
        })
      }
      else{
        arr.splice(arr.findIndex(a => a === d.target.value) , 1)
        setValues({
            ...values,
            [d.target.name]: arr
        })
      }
      
  }
  const ref = useD3(
    (div) => {
        let keys = ['topic','sector','region','source','country']
        keys.forEach(key => {
            let options = [...new Set(data.map(d => d[key]))].filter(a => {return a !== ''})

            let checkBox = div.select(`.${key}-filter`)
                .select('.scrollable')
                .selectAll('label')
                .data(options)
                .enter()
                .append('div')
            
            checkBox
                .insert('input')
                .attr('value', d => d)
                .attr('type', 'checkbox')
                .attr('name', key)
                .on('click',handleCheckBoxInput)
            checkBox
                .append('span')
                .text(d => d)
        })

        d3.select('span#reset')
        .on('click',function(e){
            d3.selectAll('input[type=\'checkbox\']')
            .property('checked', false);
            addFilters({
                reset: true
            })
        })
    },
    [data.length]
  );

  return (
    <div ref={sideNav} id="mySidenav" className="sidenav">
        <button className="hide" onClick={hideFiltersMenu}>
            &times;
        </button>
        <form className="filters-list" onSubmit={handleFilterForm} ref={ref}>
            <div>
                <label htmlFor="start_year">YEAR_RANGE</label>
                <div className="years-filter">
                    <input name="start_year" type="text" value={values.start_year} onChange= {handleInputChange} />-
                    <input name="end_year" type="text" value={values.end_year} onChange= {handleInputChange} />
                </div>
                <div className="filters-list-grid">
                    <div className="topic-filter">
                        <label>TOPIC FILTER</label>
                        <div className="scrollable"></div>
                    </div>
                    
                    <div className="sector-filter">
                        <label>SECTOR FILTER</label>
                        <div className="scrollable"></div>
                    </div>
                    
                    <div className="region-filter">
                        <label>REGION FILTER</label>
                        <div className="scrollable"></div>
                    </div>
                    
                    <div className="country-filter">
                        <label>COUNTRY FILTER</label>
                        <div className="scrollable"></div>
                    </div>
                    
                    <div className="source-filter">
                        <label>SOURCE FILTER</label>
                        <div className="scrollable"></div>
                    </div>
                </div>
            </div>
            
            <input type="submit" value="Apply" />
            <span id="reset" style={{background: '#fd8f23',marginLeft: '.5rem'}}> Reset </span>
        </form>
    </div>
  );
}

export default FiltersMenu;