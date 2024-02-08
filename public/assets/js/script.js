
$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"').attr("content"),
    },
});



$(document).ready(function () {
    $("#createBook").click(function () {
        $("#createModal").modal("toggle");
    });
    var status = true;
    var book_Id ;

    $("#bookForm").validate({
        rules: {
            title: {
                required: true,
                minlength: 10,
                maxlength: 255,
            },
            author: {
                required: true,
                minlength: 10,
                maxlength: 255,
            },
            genre: {
                required: true,
                minlength: 10,
                maxlength: 255,
            },
        },

        messages: {
            title: {
                required: "Please enter a title.",
                minlength: "The title must be at least 10 characters long.",
                maxlength: "The title cannot exceed 255 characters.",
            },
            author: {
                required: "Please enter an author.",
                maxlength: "The author's name cannot exceed 255 characters.",
            },
            genre: {
                required: "Please enter a genre.",
                maxlength: "The genre cannot exceed 255 characters.",
            },
        },

        submitHandler: function (form) {
            const formData = $(form).serializeArray();

            if(status){
                var url= `books`;
                var methode = "POST"
            }else {
                var url= `books/${book_Id}`;
                var methode = "PUT"
            }


            $.ajax({


                url: url,
                type: methode,
                data: formData,
                beforeSend: function () {
                    console.log("Loading...");
                },
                success: function (response) {
                    console.log("res", response);

                    $("#bookForm")[0].reset();
                    $("#createModal").modal("toggle");


                    if (response.status === "success") {
                        Swal.fire({
                            icon: "success",
                            title: "Success!",
                            text: response.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        $("#bookTable").append(`
                            <tr id="book_${response.book.id}">
                                <td>${response.book.id}</td>
                                <td>${response.book.title}</td>
                                <td>${response.book.author}</td>
                                <td>${response.book.genre}</td>
                                <td>
                                    <div>
                                        <a class="btn btn-info" data-id="${response.book.id}">Show</a>
                                        <a class="btn btn-primary" data-id="${response.book.id}">Edit</a>
                                        <a class="btn btn-danger deleteButton" data-id="${response.book.id}">Delete</a>
                                    </div>
                                </td>
                            </tr>
                        `);
                    } else if (response.status === "failed") {
                        Swal.fire({
                            icon: "error",
                            title: "Failed!",
                            text: response.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                },
                error: function (error) {
                    console.log("error", error);
                },
            });
        },
    });
    $("#bookTable").DataTable();

    // Edit book
    $("#bookTable").on("click", ".editButton", function () {
        const bookId = $(this).data("id");
        book_Id= $(this).data("id");
        status = false;
        bookId && fetchBook(bookId);
    });

    function fetchBook(bookId) {
        if (bookId) {
            $.ajax({
                url: `/books/${bookId}/edit`,
                type: "GET",
                success: function (response) {
                    console.log(response);

                    if (response.status === "success") {
                        const book = response.book;

                        $("#bookForm #title").val(book.title);
                        $("#bookForm #author").val(book.author);
                        $("#bookForm #genre").val(book.genre);

                        $(" input");
                        $("#bookForm button[type=submit]");
                        $("#bookForm").append(`<input type="hidden" id="hidden-todo-id" value="${book.id}"/>`);
                        $("#createModal").modal("toggle");
                        
                    }
                },
                error: function (error) {
                    console.log(error);
                },
            });
        }

    }









    // delete advert
    $("#bookTable").on("click", ".deleteButton", function () {
        const bookId = $(this).data("id");

        if (bookId) {
            Swal.fire({
                title: "Are you sure?",
                text: "Once deleted, You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Suppression de l'annonce via une requête AJAX
                    $.ajax({
                        url: `/books/${bookId}`,
                        type: "DELETE",
                        success: function (response) {
                            console.log(response);
                            if (response.status === "success") {
                                // Annonce supprimée avec succès
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "book has been deleted.",
                                    icon: "success",
                                    timer: 1500,
                                });

                                // Supprimer la ligne du tableau correspondant à l'annonce supprimée
                                $(`#book_${bookId}`).remove();
                            } else {
                                // Échec de la suppression
                                Swal.fire({
                                    title: "Failed!",
                                    text: "Unable to delete book!",
                                    icon: "error",
                                });
                            }
                        },
                        error: function (error) {
                            // Erreur lors de la requête AJAX
                            Swal.fire({
                                title: "Failed!",
                                text: "Unable to delete bookt!",
                                icon: "error",
                            });
                        },
                    });
                }
            });
        }
    });
});
