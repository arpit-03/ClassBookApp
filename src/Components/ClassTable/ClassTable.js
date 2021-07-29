import React from "react";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
export const ClassTable = props =>{
return(<div>
    <table>
        <thead>
        <tr>
            {Object.keys(props.modal).map((item,index) =>{
                if (item !== "SelectionPane")
                return(
                <th key={index}>{item}</th>
                )
                else
                return (
                    <th key ={index}></th>
                )
            
        })}
        </tr>
        </thead>
        <tbody>
        {props.content && props.content.length >0 && 
        props.content.map((item,index) =>{
            return(
            <tr key ={index}>
            <td>{item['Date']}</td>
            <td>{item['Time']}</td>
            <td>{item['Availibility'] + " seats available"}</td>
            <td><Button variant={props.cartView ? "warning" : item['Availibility'] === 0 ? "danger" : "primary"} disabled ={props.bookedClasses.get(item['Id']) && !props.cartView ? true : false} onClick= {() => props.cartView ? props.handleBook(item['Id'], "removeSeat"): props.handleBook(item['Id'], "addSeat")}>{props.cartView ? "CANCEL":item['Availibility'] === 0 ? "FULL" : props.bookedClasses.get(item['Id']) ? "BOOKED" : "BOOK NOW"}</Button></td>
            </tr>
            )
        })
        }
        </tbody>
    </table>
   { props.content && props.content.length === 0 ? props.cartView ? <div className = "no-result">Nothing Added in Cart</div> : <div className = "no-result">No Data Available</div>:<div></div>}
</div>)
}