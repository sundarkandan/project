for(i=1;i<=50;i++){
    var k=document.getElementById("seat");
    var val=`<div class='seat' id='seat`+i+`' onclick='ticket("seat`+i+`")'></div>`;
    console.log(val)
}

function color_change(id_name1,color_value1,id_name2,color_value2,id_name3,color_value3,tab1,tab2,tab3){
    document.getElementById(id_name1).style.color=color_value1;
    document.getElementById(id_name2).style.color=color_value2;
    document.getElementById(id_name3).style.color=color_value3;
    document.getElementById(tab1).style.display="block";
    document.getElementById(tab2).style.display="none";
    document.getElementById(tab3).style.display="none";
}
function di(){
    document.getElementById('tab2').style.display="none";
    document.getElementById('tab3').style.display="none";
    document.getElementById('tab1').style.display="block";
}
function anim(tab1,vals1,tab2,vals2){
    document.getElementById(tab1).style.animation=vals1;
    document.getElementById(tab2).style.animation=vals2;
}
var for_btn=0
function chang(id1,id2,id3,id4,id5,id6,id7){
    document.getElementById(id1).style.backgroundColor="orange";
    document.getElementById(id2).style.backgroundColor="rgb(29, 27, 27)";
    document.getElementById(id3).style.backgroundColor="rgb(29, 27, 27)";
    document.getElementById(id4).style.backgroundColor="rgb(29, 27, 27)";
    document.getElementById(id5).style.backgroundColor="rgb(29, 27, 27)";
    document.getElementById(id6).style.backgroundColor="rgb(29, 27, 27)";
    document.getElementById(id7).style.backgroundColor="rgb(29, 27, 27)";
    document.getElementById("ti").style.display="flex";
    document.getElementById("sell").style.display="block";
    
}

function bok(){
    var min=Math.floor(20);
    var max=Math.ceil(40);
    var booked=parseInt(Math.random()*(max-min)+min);
    var i=1
    console.log(parseInt(Math.random()*Math.ceil(50)))
    while (i<=booked){
        booked_seat=document.getElementById("seat"+parseInt(Math.random()*Math.ceil(50))).style.backgroundColor="grey";
        i=i+1  
    } 
}
var booked=0
function ticket(ids){
    if (document.getElementById(ids).style.backgroundColor=="grey"){
        document.getElementById(ids).removeEventListener()
    }
    else if (document.getElementById(ids).style.backgroundColor=="orange"){
        booked=booked-1
        document.getElementById(ids).style.backgroundColor='transparent';
        document.getElementById("text2").textContent=booked;   
        document.getElementById("text4").textContent="₹"+booked*200; 
    }
    else{
        booked=booked+1
        document.getElementById(ids).style.backgroundColor='orange'
        document.getElementById('dats').style.display="flex"
        document.getElementById("text2").textContent=booked;   
        document.getElementById("text4").textContent="₹"+booked*200; 
    }
   
}
