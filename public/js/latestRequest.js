$(document).ready(() => {
    $("#latestRequestModalButton").click(() => {
        console.log("click button");
        $("#list").html('');
        $.get("/latestRequests", (results = {}) => {
            console.log("running get latest requests");
            console.log("result:" + results);
            // console.log("result len:" + results.size);
            // for (let item in results) {
            // console.log(d + ":" + results[d]);
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

        });
    });
});