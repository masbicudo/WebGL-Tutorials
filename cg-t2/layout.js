var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}

window.addEventListener("load", function(event) {
    if (document.referrer != "" && getLocation(document.referrer).host == document.location.host) {
        var a = document.querySelector('.page-heading > a')
        console.log("Replacing href of go-back link", a)
        a.href = document.referrer
        a.addEventListener("click", function(event) {
            window.history.back()
            event.preventDefault()
            return 0
        })
    }
})
