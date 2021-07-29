import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React , {useState,useEffect} from "react";
import { CLASS_BOOK_TABLE_MODAL, FULL_CLASSES, TOTAL_CLASSES_ALLOWED_PER_WEEK, TOTAL_NUMBER_OF_CLASSES } from "../../Constants/constants";
import { ClassTable } from "../ClassTable/ClassTable";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Cart } from "../Cart/Cart";
import "../BookClass/BookClass.scss";
import 'react-notifications/lib/notifications.css';

export const BookClass = () =>{
    const getRandomNumberInInterval = (start, end) =>{ 
        return Math.floor(Math.random() * (end - start + 1) + start)
      }

    const [timeLeft, setTimeLeft] = useState(getRandomNumberInInterval(30,60));
    const [seatsLeft, setSeatsLeft] = useState(getRandomNumberInInterval(7,15));
    const [classData , setClassData] = useState([]);
    const [seatsBooked, setSeatsBooked] = useState (0);
    const [bookedClasses , setBookedClasses] = useState(new Map());
    const [cartView , setCartView] = useState(false);
    const [bookedClassesData , setBookedClassesData] = useState([]);
      useEffect(()=> {
        const intervalId = setInterval(() => {
            if (timeLeft > 0 ){
                setTimeLeft(timeLeft - 1);
            }
          }, 1000);
    
          return () => clearInterval(intervalId);
      },[timeLeft]);

    const prepareClassData = () =>{
        let totalNumberOfClasses = Number(TOTAL_NUMBER_OF_CLASSES);
        let classData =[];
        // we prepare data for classes within 3 weeks 
        // random dates will be choosen with per week 5 classes
        for (let i =0 ;i< totalNumberOfClasses ; i++){
            let date = new Date();
            const todaysTime = new Date();
            if (i >=0 && i <5){
                let tempDate = new Date();
                tempDate.setDate(todaysTime.getDate()+ (7 -todaysTime.getDay()))
                date = randomDate(todaysTime,tempDate);
            }
            else if (i >=5 && i <10){
                let startDate = new Date();
                let endDate = new Date();
                startDate.setDate(todaysTime.getDate()+ (8 -todaysTime.getDay()))
                endDate.setDate(todaysTime.getDate()+ (8 -todaysTime.getDay()) +6)
                date = randomDate(startDate,endDate);
            }
            else if (i>=10 && i<15){
                let startDate = new Date();
                let endDate = new Date();
                startDate.setDate(todaysTime.getDate()+ (8 -todaysTime.getDay()) +7)
                endDate.setDate(todaysTime.getDate()+ (8 -todaysTime.getDay()) +13)
                date = randomDate(startDate,endDate)
            }
            classData.push({
                Id: i,
                Date: moment(date).format('ll'),
                Time: moment(date).format("HH:mm:ss") +" - "+ moment(date).add(1,"hour").format("HH:mm:ss"),
                Availibility: getRandomNumberInInterval(1,7),
            });
        }
        //random shuffling and setting 5 classes with availibility 0
        let classDataShuffled = [...classData];
        classDataShuffled.sort( function() { return 0.5 - Math.random() } );
        let shuffledMap = new Map();
        classDataShuffled.forEach((item,index) =>{
            if (index < Number(FULL_CLASSES)){
                shuffledMap.set(item['Id'],item);
            }
        })
        classData.map((item)=>{
            if (shuffledMap.has(item['Id'])){
                item['Availibility'] =0
            }
        });
        setClassData(classData);

    }



    const checkIfWeekCanAddClass = (date) =>{
        let yearWeekMap = new Map();
        bookedClassesData.map(data =>{
            let tempKey = moment(data['Date'],'ll').year() + "-" + moment(data['Date'],'ll').isoWeek();
            if (yearWeekMap.has(tempKey)){
                yearWeekMap.set(tempKey,Number(yearWeekMap.get(tempKey)) + Number(1) );
            }else{
                yearWeekMap.set(tempKey, Number(1));
            }
        });
        let currentKey = date.year() + "-"+ date.isoWeek();
        if (yearWeekMap.get(currentKey) >= Number(TOTAL_CLASSES_ALLOWED_PER_WEEK)){
            return false;
        }
        return true;
    }

    useEffect(()=>{
        prepareClassData();
    },[]);

    const handleBook = (id, type) =>{
        let classDataNew = classData;
        let seatsBookedNew = seatsBooked;
        let seatsLeftNew = seatsLeft;
        let bookedClassNew = bookedClasses;
        let bookedClassesDataNew = bookedClassesData;
        classDataNew.filter(item => item.Id === id).map(item => {
            if (type === "addSeat"){
            if (item['Availibility'] >0 && (!bookedClasses.has(id)) && seatsLeft > 0 && checkIfWeekCanAddClass(moment(item['Date'],'ll'))){
                item['Availibility'] = item['Availibility'] -1;
                seatsBookedNew = seatsBookedNew +1;
                seatsLeftNew =seatsLeftNew -1;
                bookedClassNew.set(id , item);
                bookedClassesDataNew.push(item);
            }else if (!checkIfWeekCanAddClass(moment(item['Date'],'ll'))){
                NotificationManager.error("Cannot book more than " + Number(TOTAL_CLASSES_ALLOWED_PER_WEEK) + " classes per week", '', 2000,()=>{});
              
            }else if (item['Availibility'] === 0){
                NotificationManager.error("No Seats Available", '', 2000, () => {
                  });
            }else if (bookedClasses.has(id)){
                NotificationManager.error("Class Already Booked", '', 2000, () => {
                });
            }else if (seatsLeft <=0){
                NotificationManager.error("No Free Seats Left", '', 2000, () => {
                });
            }
        }else if (type === "removeSeat"){
            item['Availibility'] = item['Availibility'] +1;
            seatsBookedNew = seatsBookedNew -1;
            seatsLeftNew =seatsLeftNew +1;
            bookedClassNew.delete(id)
            let index = bookedClassesDataNew.indexOf(item);
            if (index > -1) {
                bookedClassesDataNew.splice(index, 1);
            }
        }
        })
        setClassData(classDataNew);
        setSeatsBooked(seatsBookedNew);
        setSeatsLeft(seatsLeftNew);
        setBookedClasses(bookedClassNew);
        setBookedClassesData(bookedClassesDataNew)
    }

    const randomDate = (start, end) =>{
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    if (!cartView)
    return(
        <div className = "mainView">
            <div className= "timer">Time Left : {timeLeft} seconds</div>
            <div className= "classHeader">
            <div><h3>Claim Your Free Trial Class</h3></div>
            <div onClick={()=> setCartView(true)} className ="flex">
            <div className = "cart"><FontAwesomeIcon icon={faShoppingCart}/></div>
            <div className = "notif">{seatsBooked}</div>
            </div>
            </div>
            <NotificationContainer/>
            <div className= "classHeader">
                <div className = "scheduleHeader"><p>Class Schedule</p></div>
                <div className ="flex font-weight=600"><p>Free Seats Left : </p><p className = "yellow">{seatsLeft}</p></div>
            </div>
            <div>
                <ClassTable
                content = {classData}
                modal = {CLASS_BOOK_TABLE_MODAL}
                handleBook ={handleBook}
                bookedClasses = {bookedClasses}/>
            </div>
        </div>
    )
    else
    return(
        <div>
            <Cart
            handleBook = {handleBook}
            content = {bookedClassesData}
            bookedClasses ={bookedClasses}
            setHomeView = {()=> setCartView(false)}/>
        </div>
    )
}