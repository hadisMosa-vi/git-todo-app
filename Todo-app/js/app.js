const addButton=document.getElementById("add-button");
const editButton=document.getElementById("edit-button");
const filterButtons=document.querySelectorAll(".filter-todos")
let taskInput=document.getElementById("task-input");
let dateInput=document.getElementById("date-input");
const alertMessage=document.getElementById("alert-message");
const todosBody=document.querySelector("tbody");
const deleteAllButton=document.getElementById("delete-all-button");
const completedButton=document.getElementById("completed-button")


let todos =JSON.parse(localStorage.getItem("todos")) || [];

 //(این یک نوع کوتاه نویسی است به جای نوشتن ایف الس) اگر داخل تودوز مقدار وجود داشته باشد
// ان را از لوکال استوریج می گیرد وداخل تودوز قرارمی دهد ولی اگر اولین بار است که برنامه اجرا میشه و تودوز هیچ مقداری ندارد 
// مقدار بعد از||اجرا میشه وتودوز را برابر یک آرایه خالی قرار می دهد
 
// if(JSON.parse(localStorage.getItem("todos")) === null){
//    const todos=[];
//    console.log(todos);
// } else {
//      todos =JSON.parse(localStorage.getItem("todos")) ;
//      console.log(todos);
//     }

const replictToLocalStorage =() =>{
    localStorage.setItem("task",'${todo.task}');
    localStorage.setItem("date",'${todo.date}');
}
const saveToLocalStorage =() => {
    localStorage.setItem("todos",JSON.stringify(todos));
}

const displayTodos = (data) => {
    const todoList = data ? data :todos ;
    todosBody.innerHTML ="";
    if(!todoList.length) {
        todosBody.innerHTML = "<tr><td colspan =4 > No Task Find! </td></tr> ";
        
    } 

    todoList.forEach(todo =>{ 
       todosBody.innerHTML += `
       <tr>
         <td>${todo.task}</td>
         <td>${todo.date ||"NoDate"}</td>   
         <td>${todo.completed ? "complete" : "pending"}</td>
         <td>
         <button onclick ="editHandler('${todo.id}')">Edit</button>
         <button onclick ="toggleHandler('${todo.id}')"> ${ todo.completed ? "UnDo" : "Do"} </button>
         <button onclick ="deleteHandler('${todo.id}')">delete</button>
         </td>
       </tr>
       `;  
    });
};



const generateId =()=>{
    return Math.round(
        Math.random() * Math.random() * Math.pow(10,15)
    ).toString();
   
   };
   

const showAlert =(message,type)=>{
    alertMessage.innerHTML=""; 
   const alert =document.createElement("p");
   alert.innerText =message;
   alert.classList.add("alert");
   alert.classList.add(`alert-${type}`);
   alertMessage.append(alert);
  
 setTimeout(()=>{
     alert.style.display="none";
 },2000);
}



const addHandler =(event) => {
    const task=taskInput.value;
    const date=dateInput.value;
    const todo ={
        id:generateId(),
        completed:false,
        task,    //or task:task,
        date,    //or date:date,
        };
    if(task){
        todos.push(todo);
        saveToLocalStorage();
        displayTodos()
        taskInput.value= "";
        dateInput.value= "";
        showAlert("todo added successfully","success");
    } else{ 
        
        showAlert("please enter todo!","error");
        
    }
    
};

const deleteAllHandler =() =>{
    if(todos.length){
        todos =[];
        saveToLocalStorage();
        displayTodos();
        showAlert("All Todos cleared successfully","success");    
     } else {
        showAlert("No Todos For Clear!","error");
     }
  };

const deleteHandler =(id) =>{
   const newTodo =todos.filter((todo) => todo.id !== id );
   todos =newTodo ;
   saveToLocalStorage();
   displayTodos();
   showAlert("todo deleted successfully","success");
};

const toggleHandler =(id) =>{
   const todo =todos.find(todo => todo.id === id);   //استفاده از متد فایند بهینه تره چون وقتی لوپ میزنه اولین مورد مطابق را که پیدا کنه دیگه لوپ زدن را ادامه نمیده
     todo.completed = !todo.completed;      
   saveToLocalStorage();
   displayTodos();
   showAlert("Todo status changed successfully","success");
};

const editHandler =(id) => {
    const todo =todos.find(todo => todo.id === id);
    taskInput.value =todo.task;
    dateInput.value =todo.date;
    addButton.style.display ="none";
    editButton.style.display ="inline-block";
    editButton.dataset.id = id;
};

const  applyEditHandler = (event) => {
  const id =event.target.dataset.id;
  const todo =todos.find((todo) => todo.id === id );
  todo.task =taskInput.value;
  todo.date =dateInput.value;
  taskInput.value= "";
  dateInput.value="";
  addButton.style.display ="inline-block";
  editButton.style.display ="none";
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo edited successfully","success");
};

const filterHandler= ((event)=>{
    let filteredTodos =null;
    const filter = event.target.dataset.filter;
    const todo =  todos.find((todo)=> todo.completed );
    if(filter === "all"){
        filteredTodos = todos;
    
    }else
       if(filter === "pending"){
         filteredTodos =todos.filter((todo) => todo.completed === false);
         
       } else{
           filteredTodos = todos.filter((todo)=> todo.completed === true);
        
       }
       displayTodos(filteredTodos);
});

window.addEventListener("load" ,() => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click",deleteAllHandler);
editButton.addEventListener("click" , applyEditHandler);
filterButtons.forEach((button)=>{
    button.addEventListener("click", filterHandler);
});


