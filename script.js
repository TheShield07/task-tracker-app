let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const list = document.getElementById("taskList");
const empty = document.getElementById("empty");
const today = document.getElementById("today");

today.innerText = new Date().toDateString();

addBtn.onclick = () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const date = dateInput.value;
    const priority = priorityInput.value;

    if(!title){
        empty.innerHTML="⚠️ Task name required";
        return;
    }

    tasks.unshift({
        title,
        desc,
        date,
        priority,
        completed:false
    });

    titleInput.value="";
    descInput.value="";
    dateInput.value="";
    priorityInput.value="";

    save();
};

function save(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
    render();
}

function setFilter(f){
    filter=f;
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    event.target.classList.add("active");
    render();
}

function render(){
    list.innerHTML="";
    empty.innerHTML="";

    let sorted=[...tasks].sort((a,b)=>a.completed-b.completed);

    let visible = sorted.filter(t=>{
        if(filter==="pending") return !t.completed;
        if(filter==="completed") return t.completed;
        return true;
    });

    if(visible.length===0){
        if(filter==="pending") empty.innerHTML="😌 No pending tasks";
        else if(filter==="completed") empty.innerHTML="🏁 No completed tasks yet";
        else empty.innerHTML="📭 No tasks yet";
        return;
    }

    visible.forEach(task=>{
        const i = tasks.indexOf(task);
        const li=document.createElement("li");
        if(task.completed) li.classList.add("completed");

        li.innerHTML=`
        <div>
            <div class="task-title">${task.title}</div>
            <div class="task-desc">${task.desc||""}</div>
            <div class="meta">${task.priority||"No priority"} • ${task.date||"No date"} • ${task.completed?"Completed":"Pending"}</div>
        </div>
        <button class="action" onclick="toggle(${i})">${task.completed?"Undo":"Done"}</button>
        `;
        list.appendChild(li);
    });
}

function toggle(i){
    tasks[i].completed=!tasks[i].completed;
    save();
}

render();
