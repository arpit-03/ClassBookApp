import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { CLASS_BOOK_TABLE_MODAL } from "../../Constants/constants";
import { ClassTable } from "../ClassTable/ClassTable";
import "../BookClass/BookClass.scss";
export const Cart = props =>{
    return (
        <div className = "mainView">
            <div className = "classHeader">
            <div className = "scheduleHeader"><p>Cart</p></div>
            <div className = "cart" onClick= {() => props.setHomeView()}><FontAwesomeIcon icon ={faHome}/></div>
            </div>
            <ClassTable
            modal = {CLASS_BOOK_TABLE_MODAL}
            content={props.content}
            bookedClasses ={props.bookedClasses}
            cartView={true}
            handleBook = {props.handleBook}/>
        </div>
    )
}