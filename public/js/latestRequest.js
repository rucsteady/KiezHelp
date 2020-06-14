$(document).ready(() => {
    $("#latestRequestModalButton").click(() => {
        console.log("click button");
        $("#list").html('');
        $.get("/latestRequests", (results = {}) => {
            console.log("running get latest requests");

            if (results.length > 0) {
                results.forEach((request) => {
                    $("#list").append(`
                <table class="w3-table-all">
                    <thead>
                    <tr class=${request.type=='Volunteer'? "w3-blue":"w3-orange"}>
                        <th> ${request.type}</th>
                        <th> </th>
                        <th class="w3-right-align"> <button class="accept-button w3-button w3-black" data-id="${request._id}">
                        Accept Request
                    </button></th>
                    </tr>
                    </thead>
                    <tr>
                    <td> ${request.name}</td>
                    <td> ${request.address}</td>
                    <td> ${request.option}</td>
                    </tr>
                </table>
                
                `);
                });
            } else {
                $("#list").append('<p>No latest requests available</p>');
            }

        }).then(() => {
            addAcceptButtonListener();
        });

    });
});

let addAcceptButtonListener = () => {
    //res.locals.currentUser._id
    $(".accept-button").click((event) => {
        let $button = $(event.target),
            requestId = $button.data("id");
        // console.log("loggedin:" + res.locals.loggedIn);
        // console.log("authen:" + req.isAuthenticated());
        // if (res.locals.loggedIn) {
        $.get(`/requests/accept/${requestId}`, (results = {}) => {
            // console.log("results:" + results);
            // console.log("results.data:" + results.data);
            // console.log("success:" + res.locals.success);
            let data = results.data;
            // if (data && data.success) {
            $button
                .text("Accepted")
                .addClass("accepted-button")
                .removeClass("accept-button");
            // } else {
            //     $button.text("Try again");
            // }
        });
        // } else {
        //     $.get(`/loginFirst`, (results = {}) => {

        //     });
        // }

    });
}