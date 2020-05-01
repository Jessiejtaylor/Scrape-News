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