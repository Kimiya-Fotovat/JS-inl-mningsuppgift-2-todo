var form = document.getElementById('todoForm');
var output = document.getElementById('output');
var input = document.getElementById('todoInput');
var todos = [];
var error = document.getElementById('error')

fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(json => {
        console.log(json)
        todos = json.splice(0,10);
        updateUI();
    })


function updateUI() {

    output.innerHTML = '';

    var i = 0;
    todos.forEach(todo => {
        var isCompleted = todo.completed ? 'isCompleted' : '';
        output.innerHTML += `
        <div class="card transparent">
          <div class="d-flex justify-content-between ms-3">
            <h3 class="title yellow ${isCompleted}" id="${i}">${todo.title}</h3>
            <div class="my-auto">
                
                <a class="design me-3 Danger delete" id="${i}"><i class="fas fa-trash-alt"></i></a>
            </div>
          </div>
        </div>
        `;
        i++;
    })
    deleteTodo();
    completeTodo();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value==''){
        error.innerText='Please enter your planned activity! The box is empty';
        setTimeout(()=>{
            error.innerText='';
        },3000)
    }
    else{
        error.innerText='';
        fetch('https://jsonplaceholder.typicode.com/todos/', {
            method: 'POST',
            body: JSON.stringify({
                userId: 1,
                title : input.value,
                completed: false,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
        }).then(response => response.json()).then(json => {
            todos.unshift(json);
            todos = todos.splice(0,10);
            //console.log(todos)
            updateUI();
        })
    }
   

    input.value='';
    
});

function deleteTodo() {
    var deleteBtns = document.querySelectorAll('.delete');

    deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', () => {
            if(todos[deleteBtn.id].completed){
                fetch('https://jsonplaceholder.typicode.com/posts/'+(deleteBtn.id + 1), {
                method: 'DELETE',
            }).then(response => {
                todos.splice(deleteBtn.id, 1);
                updateUI();
            })       
            }
             else{
                error.innerText='chosen activity is not done yet';
                setTimeout(()=>{
                    error.innerText='';
                },3000)
             }    
        })
    });
}

function completeTodo() {
    var titles = document.querySelectorAll('.title');

    titles.forEach(title => {
        title.addEventListener('click', () => {
            
            if (todos[title.id].completed) {
                updateServer((todos[title.id]+1), 'false');
                todos[title.id].completed = false;
            }else {
                updateServer((todos[title.id]+1), 'true');
                todos[title.id].completed = true;
            }

            updateUI();
        })
    });
}

function updateServer(id, status) {
    fetch('https://jsonplaceholder.typicode.com/todos/'+id, {
        method: 'PATCH',
        body: JSON.stringify({
            completed: status,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
    }).then(response => response.json()).then(json => {
        console.log(json);
    })
}
