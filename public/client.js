$(() => {

  // View ////////////////////////////////////////////////////////////////////////

  var template = _.template(`
    <li data-id="<%=id%>" class="todo">
      <span><%=text%></span>
      <button data-action="edit">edit</button>
      <button data-action="done">&#x2714;</button>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;created at: <%=createdAt%></span>
    </li>
  `);

  var updatedTemplate = _.template(`
    <li data-id="<%=id%>" class="todo">
      <span><%=text%></span>
      <button data-action="edit">edit</button>
      <button data-action="done">&#x2714;</button>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;created at: <%=createdAt%>&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span>edited at: <%=updatedAt%></span>
    </li>
  `);
  // doesn't work because JSON.parse returns a string not a Date object
  // var fixTimeDisplay = ({id, text, createdAt, updatedAt}) => {
  //   createdAt = createdAt.toDateString() + ' ' + createdAt.toTimeString();
  //   if (updatedAt) {
  //     updatedAt = updatedAt.toDateString() + ' ' + updatedAt.toTimeString();
  //   }
  //   return {id, text, createdAt, updatedAt};
  // }
  
  var renderTodo = (todo) => {
    if (todo.updatedAt) {
      return updatedTemplate(todo);
    } else {
      return template(todo);
    }
  };

  var addTodo = (todo) => {
    $('#todos').append(renderTodo(todo));
  };

  var changeTodo = (id, todo) => {
    $(`#todos [data-id=${id}]`).replaceWith(renderTodo(todo));
  };

  var removeTodo = (id) => {
    $(`#todos [data-id=${id}]`).remove();
  };

  var addAllTodos = (todos) => {
    _.each(todos, (todo) => {
      addTodo(todo);
    });
  };

  // Controller //////////////////////////////////////////////////////////////////

  $('#form button').click( (event) => {
    var text = $('#form input').val().trim();
    if (text) {
      Todo.create(text, addTodo);
    }
    $('#form input').val('');
  });

  $('#todos').delegate('button', 'click', (event) => {
    var id = $(event.target.parentNode).data('id');
    if ($(event.target).data('action') === 'edit') {
      Todo.readOne(id, (todo) => {
        var updatedText = prompt('Change to?', todo.text);
        if (updatedText !== null && updatedText !== todo.text) {
          Todo.update(id, updatedText, changeTodo.bind(null, id));
        }
      });
    } else {
      Todo.delete(id, removeTodo.bind(null, id));
    }
  });

  // Initialization //////////////////////////////////////////////////////////////

  console.log('CRUDdy Todo client is running the browser');
  Todo.readAll(addAllTodos);

});
