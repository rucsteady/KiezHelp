// $(document).ready(() => {

//     $("#modal-button").click(() => {
//         console.log("click");
//         $(".modal-body").html('');
//         $.get("/api/user", (data) => {
//             console.log("data:" + data);

//             for (let d in data) {
//                 console.log("d:" + d);
//                 console.log("d.value:" + data[d]);
//                 $(".modal-body").append(
//                     `<div>
//                     <span class="course-title">
//                     ${d} : ${data[d]}
//                     </span>
//                     </div>`
//                 );
//             }
//         });
//     });
// });