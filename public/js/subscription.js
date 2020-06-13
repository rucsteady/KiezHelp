$(document).ready(() => {
    $("#modal-button").click(() => {
        $(".modal-body").html('');
        $(".modal-body").append(
            `<div>
<span class="course-title">
hi
</span>
<div class="course-description">
hey
</div>
</div>`
        );
        $.get("/profile?format=json", (data) => {
            // data.forEach((course) => {
            //             $(".modal-body").append(
            //                 `<div>
            //    <span class="course-title">
            //    hi
            //    </span>
            //    <div class="course-description">
            // hey
            //    </div>
            //    </div>`
            //             );
            // });
        });
    });
});