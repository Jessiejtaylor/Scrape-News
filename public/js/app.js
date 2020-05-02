$(".btn").on("click", function () {
  var id = $(this).attr("data-id")
  console.log(id)
  $.ajax({
    url: "/api/articles/" + id,
    method: "PUT"
  }).then(function (result) {
    console.log(result)
    location.reload()
  })
})


$(".removeBtn").on("click", function () {
  var id = $(this).attr("data-id")
  console.log(id)
  $.ajax({
    url: "/api/articles/" + id,
    method: "DELETE"
  }).then(function (result) {
    console.log(result)
    location.reload()
  })
})

// jessie test code for notes

// $(".notes").on("click", function () {
//   var id = $(this).attr("data-id")
//   console.log(id)
//   $.ajax({
//     url: "api/notes/" + id,
//     method: "GET"
//   }).then(function (result) {
//     console.log(result)

//   })
// })

// code from github girl

const getNotes = id => {
  const url = `/api/notes/${id}`;
  console.log("GET request: " + url);

  $.ajax(url, {
    type: "GET"
  })
    .then(results => {
      $("#modalNotesForm .modal-body").html(results);

      $("#modalNotesForm").modal("show");
    })
    .fail(error => console.error(error));
};

const getMessageDiv = message =>
  $("<div>")
    .addClass("card")
    .append($("<div>")
      .addClass("card-body primary-color text-center")
      .append($("<p>")
        .addClass("note card-text d-inline white-text font-bold")
        .text(message)));

const addNoHeadlinesMessage = message => {
  let divCard = getMessageDiv(message);

  $(".headlines").append(divCard);
};

const addNoNotesMessage = () => {
  const message = `No notes currently exist. Add the first one!`;
  let divCard = getMessageDiv(message);

  $("#note-container .list-group").remove();
  $("#note-container").prepend(divCard);
};