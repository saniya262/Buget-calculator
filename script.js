function register(){
    uname=document.getElementById("uname").value
    email=document.getElementById("email").value
    password=document.getElementById("pswd").value
    console.log(email,password,uname);


    if(email=='' || uname=='' || password==''){
        alert("Enter All Fields")
    }
    else{
        if(email in localStorage){
            alert("User email Already registered")
        }
        else{
            const userobj={
                    uname,
                    password,
                    email,
                    income:0,
                    expense:0,
                    incomeArray:[],
                    expenseArray:[]

            }
            localStorage.setItem(email,JSON.stringify(userobj))
            alert("User Registered Successfully")
            window.location='./index.html';

        }
    }
}


function login(event){
    event.preventDefault();

   
    let useremail=document.getElementById("uemail").value
    let pswd=document.getElementById("password").value

    if(useremail=='' || pswd==''){
        alert("Enter all fields")
    }
    else{
        if(useremail in localStorage){
            
            let newObj=JSON.parse(localStorage.getItem(useremail));
            console.log(newObj);
            if(pswd===newObj.password){
                localStorage.setItem('loggedobj',JSON.stringify(newObj))
                localStorage.setItem("loggedkey",useremail)

                alert("Login Successful")
                window.location='./wallet.html'
            }
            else{
                alert("Wrong Password: login failed")
                document.getElementById("password").value=" "
            }
            

        }
        else{
            alert("User Does not exist, Please register")
        }
    }
}


const loggedkey=localStorage.getItem("loggedkey")

welcomeuser.innerHtML=`Welcome ${loggedkey}`


function logout(){
    window.location='./index.html'
}



function addincome(){

    let incomety=document.getElementById('incometype').value
    let incomeamt=document.getElementById('incomeamount').value
    

    if(incomety===""||incomeamt===""){

        alert('Please Enter All Fields')
    }
    else{
        newobj = JSON.parse(localStorage.getItem(loggedkey)) || {};
        newobj.income = newobj.income ? newobj.income + parseFloat(incomeamt) : parseFloat(incomeamt);
        let balance = newobj.income;

        document.getElementById('displayIncomeBalance').innerHTML = `RS ${balance}/-`;
        let now=new Date();
        let date=`${now.toLocaleDateString()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
        console.log(date);
        localStorage.setItem(newobj.uname,JSON.stringify(newobj))

        
        let incomeObj={
            type:incomety,
            amount:incomeamt,
            balance:balance,
            date:date
    }
    newobj.incomeArray.push(incomeObj);
    console.log(newobj.incomeArray);
    localStorage.setItem(loggedkey,JSON.stringify(newobj))

    let displayTable=``;
    for(i of newobj.incomeArray){
        displayTable+=`
        <tr>
            <td>${i.type}</td>
            <td>+${i.amount}</td>
            <td>${i.balance}</td>
            <td>${i.date}</td>
        </tr>
        `
    }
    incomedetails.innerHTML=displayTable
    

}

}


function addexpense(){

    let expensety=document.getElementById('expensetype').value
    let expenseamt=document.getElementById('expenseamount').value


    if(expensety===""||expenseamt===""){
        alert("Please Enter All Fields")
    }

    else{
        let newobj=JSON.parse(localStorage.getItem(loggedkey))
        newobj.expense+=parseFloat(expenseamt) ;
        
        let balance=newobj.income-newobj.expense
        
        displayexpanceAmount.innerHTML=`Rs ${newobj.expense}/-`

        let now = new Date();
        let date = `${now.toLocaleDateString()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        console.log(date);

        let expenseObj = {
            type: expensety,
            amount: expenseamt,
            balance: balance,
            date: date
        };
        newobj.expenseArray = newobj.expenseArray || [];
        newobj.expenseArray.push(expenseObj);
        console.log(newobj.expenseArray);
        localStorage.setItem(loggedkey, JSON.stringify(newobj));

        let displayTable = ``;
        for (i of newobj.expenseArray) {
            displayTable += `
            <tr>
                <td>${i.type}</td>
                <td>-${i.amount}</td>
                <td>${i.balance}</td>
                <td>${i.date}</td>
            </tr>
            `;
        }
        expensedetails.innerHTML = displayTable;
    }
}

function clearall(){

    displayIncomeBalance.innerHTML=`Rs 0/-`
    displayexpanceAmount.innerHTML=`Rs 0/-`
    let newobj=JSON.parse(localStorage.getItem(loggedkey))
    newobj.income=0;
    newobj.expense=0;
    newobj.incomeArray=[];
    newobj.expenseArray=[];
    localStorage.setItem(loggedkey,JSON.stringify(newobj));
    incomedetails.innerHTML=``;
    expensedetails.innerHTML=``;
}


function generateDistinctColor(count) {
    const colors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
        "#E7E9ED", "#70C7C0", "#F97284", "#P06C84", "#6C5B7B", "#355C7D"
    ];
    
    while (colors.length < count) {
        const hue = colors.length * (360 / count);
        colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return colors.slice(0, count); 
}

function displaychart() {
    let newobj = JSON.parse(localStorage.getItem(loggedkey));
    if (!newobj || !newobj.expenseArray) {
        console.log("No expense data available.");
        return;
    }

    const ExpArray = newobj.expenseArray;
    
    let type = ExpArray.map(x => x.type);
    let values = ExpArray.map(y => parseFloat(y.amount));

    const totalexpense = ExpArray.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    const remainingBalance = newobj.income - totalexpense;
    
    type.push("Remaining Balance");
    values.push(remainingBalance);

    const customcolors = generateDistinctColor(type.length);

    const mychart = document.getElementById("inner_pie").getContext('2d');

    const chart = new Chart(mychart, {
        type: "pie",
        data: {
            labels: type,
            datasets: [{
                data: values,
                backgroundColor: customcolors,
            }],
        },
        options: {
            title: {
                display: true,
                text: "Expense Distribution"
            },
        },
    });
}

    


    


