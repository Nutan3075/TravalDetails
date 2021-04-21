const puppeteer = require("puppeteer");
let links = "https://www.redbus.in/bus-tickets?gclid=Cj0KCQjw9_mDBhCGARIsAN3PaFPeJRB5eC2VXsFKbuvHQ63OK-E-QWviYjaPHVDViup6e-lOANVabCUaAgV3EALw_wcB";
let link2="https://www.irctc.co.in/nget/train-search";
let link3="https://www.air.irctc.co.in/";
let cTab;
let source=process.argv;
(async function fn() {
    try {
        let browserOpenPromise = puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let browser = await browserOpenPromise;
        let allTabsArr = await browser.pages();
        cTab = allTabsArr[0];
        let list1 = await  getAllTheDetailOfBus(links,source);//going to the link of red bus 
        let list2 = await  getAllTheDetailOfTrain(link2,source);//through this we are going to railway website irctc
        let list3 = await  getAllTheDetailOfFlight(link3,source);// through this air ticket booking site irctc air
    } catch (err) {
        console.log(err);
    }
})();

async function getAllTheDetailOfBus(link,source) {
    await cTab.goto(link);// goto to redbus link
    await cTab.type("[type='text']", source[2], { delay: 300 });// typing  from place name
    await cTab.keyboard.press("Enter",{delay:1000});//after typing press enter
    await cTab.keyboard.press("Enter");
    await cTab.type("#txtDestination", source[3], { delay: 300 });//typing the To place name
    await cTab.keyboard.press('ArrowDown');
    await cTab.keyboard.press("Enter",{delay:1000});//after typing press enter
    await cTab.click("#txtOnwardCalendar");//select the date
    await cTab.click(".today.active");//select the active date from the calender
    await cTab.waitForSelector(".D120_search_btn.searchBuses");//waiting for selector
    await cTab.click(".D120_search_btn.searchBuses");//after that click the search box
    await cTab.waitForSelector(".travels.lh-24.f-bold.d-color");// wait for the selector all the details of the bus
    let arr=await cTab.evaluate(consoleFn1,".travels.lh-24.f-bold.d-color",".bus-type.f-12.m-top-16.l-color",".dp-time.f-19.d-color.f-bold",".dur.l-color.lh-24",".bp-time.f-19.d-color.disp-Inline",".fare.d-block")
    console.table(arr);//priting the details of the bus in table
         
   
}

function consoleFn1(BusName,BusType,Departuretime,Duartion,ArrivalTime,Fare){
    let arrofBusDetails=[];//create an array to store all the details 
    let bName=document.querySelectorAll(BusName);// selector of bus name
    let btype=document.querySelectorAll(BusType);// selector of bus type
    let bDpt=document.querySelectorAll(Departuretime);//selctor for departure time of bus
    let bdur=document.querySelectorAll(Duartion);//selector for total travel time
    let bat=document.querySelectorAll(ArrivalTime);//selector for arrival time of bus
    let bfare=document.querySelectorAll(Fare);//price of the bus

    for(let i=0;i<bfare.length;i++){
        let busname=bName[i].innerText;//selecting the innertext of the busname
        let bustype=btype[i].innerText;//selecting the innertext of the bus type
        let busDptTime=bDpt[i].innerText;//selecting the innertext of bus departure time
        let busDuration=bdur[i].innerText;//innertext of total travel time
        let busarrivalTime=bat[i].innerText;//innertext of arrival time
        let busfare=bfare[i].innerText;//price of bus
        
        arrofBusDetails.push({
            busname,bustype,busDptTime,busDuration,busarrivalTime,busfare//storing all the details of the bus
        })
    }
    return arrofBusDetails;// returing the table to main function
}




async function getAllTheDetailOfTrain(link,source)
{
    
    await cTab.goto(link);//goto to train booking site irctc 
    await cTab.click(".btn.btn-primary");
    await cTab.type(".ng-tns-c58-8.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted",source[4],{delay:300});//typing source name
    await cTab.keyboard.press('ArrowDown');
    await cTab.keyboard.press("Enter");//press enter
    await cTab.type(".ng-tns-c58-9.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted",source[5],{delay:300});//typing the destination name
    await cTab.keyboard.press('ArrowDown');
    await cTab.keyboard.press("Enter");//press enter
    await cTab.click(".ng-tns-c59-10.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ng-star-inserted");//clicking the date box
    for(let i=0;i<10;i++)
    {
        await cTab.keyboard.press('Backspace',{delay:200});// erasing previos set date;
    }
    await cTab.type(".ng-tns-c59-10.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ng-star-inserted","25/05/20",{delay:300});//type the date of journey
    await cTab.keyboard.press("Enter");//press enter
    await cTab.waitForSelector(".col-sm-5.col-xs-11.train-heading")//wait for the selector through which we can colllect all th details of train
    let arr=await cTab.evaluate(consoleFn2,//function through which we can extract all the details of trains
    ".col-sm-5.col-xs-11.train-heading",
    ".pull-left.hidden-xs span[class='Y']",
    ".white-back.no-pad.col-xs-12",
    )
    console.table(arr);

}
function consoleFn2(TrainName,RunOn,TrainDet){
    let arrofTrainDetails=[];//creating the array to store all the details
    let TName=document.querySelectorAll(TrainName);//selector for train name
    let Rtype=document.querySelectorAll(RunOn);// selector for on which day train run
    let TDet=document.querySelectorAll(TrainDet);//selector for all the details of trains

    for(let i=0;i<TName.length;i++){//this loop extract the all the data of train
        let ttrainname=TName[i].innerText;//name of the trains
        let Runon=Rtype[i].innerText;//on which day train run
        let tDetails=TDet[i].innerText;//all the details of the trains
    
        
        arrofTrainDetails.push({
            ttrainname,Runon,tDetails//storing all the details of trains
        })
    }
    return arrofTrainDetails;
}




async function getAllTheDetailOfFlight(link,source)
{
    await cTab.goto(link);// goto flight website irctc
    await cTab.waitForSelector(".btn.btn-md.blue-gradient.btn-rounded.waves-effect.waves-light.m-0.font-14.mt-1")
    await cTab.click(".btn.btn-md.blue-gradient.btn-rounded.waves-effect.waves-light.m-0.font-14.mt-1");
    await cTab.click("#stationFrom");//click source name
    await cTab.type("#stationFrom",source[6],await cTab.keyboard.press('ArrowDown'),{delay:300});//typing the source name
    //press the down array key to select the specfic source name
    await cTab.keyboard.press('ArrowDown');
    await cTab.keyboard.press("Enter");//press enter
    await cTab.type("#stationTo",source[7],{delay:300});//typing the destination name
    await cTab.keyboard.press('ArrowDown');// press down key to select specfic destination name
    await cTab.keyboard.press("Enter");//enter
    await cTab.click("#originDate");//date of the journey
    await cTab.click(".act.active-red")//click the date
    await cTab.keyboard.press("Enter");//enter
    await cTab.click(".fas.fa-location-arrow.pl-2");
    await cTab.waitForSelector(".SearchData_List_in.SearchData_Airline");
    let arr=await cTab.evaluate(consoleFn3,//all the selector to extract 
        ".SearchData_List_in.SearchData_Airline",
        ".SearchData_List_in.SearchData_Departure",
        ".SearchData_List_in.SearchData_Arrival.font-14",
        ".SearchData_List_in.SearchData_Duration.font-14",
        ".SearchData_List_in.SearchData_Price"
        )
        console.table(arr);

}

function consoleFn3(FName,DTime,Atime,Tduration,Fprice)
{
    let FlightDetails=[];
    let fName=document.querySelectorAll(FName);//name of flight
    let dTime=document.querySelectorAll(DTime);//departure time 
    let atime=document.querySelectorAll(Atime);//arrival time
    let tduration=document.querySelectorAll(Tduration);//total journey time
    let fprice=document.querySelectorAll(Fprice)//price of the flight

    for(let i=0;i<fName.length;i++){//loop to extract all the details
        console.log("inside block");
        let FlightName=fName[i].innerText.split("\n");
        let DepTime=dTime[i].innerText.split("\n");
        let ArrTime=atime[i].innerText.split("\n");
        let TotalDur=tduration[i].innerText.split("\n");
        let Price=fprice[i].innerText.split("\n");
    
        
        FlightDetails.push({
             FlightName,DepTime,ArrTime,TotalDur,Price//push into the flightdetails array
        })
    }
    return FlightDetails//return all the table

}