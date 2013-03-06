var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.report(), and not this.report()
        app.report('deviceready');
    },
    report: function(id) { 
        console.log("report:" + id);
        // hide the .pending <p> and show the .complete <p>
        document.querySelector('#' + id + ' .pending').className += ' hide';
        var completeElem = document.querySelector('#' + id + ' .complete');
        completeElem.className = completeElem.className.split('hide').join('');
    }


};

function addGroup()
{
    group_size = $("#page2 [id^='group-']").size();
    new_group = new Group()
    new_group.peopleInParty = 0;
    groups.push(new_group)
    $("<div id='topgroup-"+(group_size+1)+"-container' class='group-container'><div data-role='collapsible' data-content-theme='c' data-theme='a' id ='group-"+(group_size+1)+"' class='group-"+(group_size+1)+" visible' data-routing='group.html' style = 'width: 77%; float: left'><h3>Group "+(group_size+1)+"</h3></div><a href='#' data-transition='pop' data-role='button' data-inline='true' style='float: left; width: 20%;' data-icon='gear' data-theme='b' data-rel='popup' onclick='$(&quot;#extra-popup-"+(group_size+1)+"&quot;).popup(&quot;open&quot;)'></a><div data-role='popup' class='extra-popup' id='extra-popup-"+(group_size+1)+"' data-routing='extras.html'></div></div>").appendTo('.groups');
    $("<div data-content-theme='c' data-theme='a' id ='group-"+(group_size+1)+"' class='group-"+(group_size+1)+" visible' data-routing='total.html'><h3>Group "+(group_size+1)+"</h3></div>").appendTo('.groups-final');
    loadPartials("#group-"+(group_size+1)+"[data-routing]", false);
    loadPartials("#extra-popup-"+(group_size+1)+"[data-routing]", false);
}

function removeGroup()
{
    group_size = $("#page2 [id^='group-']").size();
    if(group_size !=1)
    {
        $("#group-"+group_size).parent().remove();
        console.log("Popped!")
        groups.pop(new Group())
        
    }
    for(var i = groups.length; i > group_size; i--){
        console.log("popping");
        groups.pop(new Group());
    }
}

function addExtra()
{

}


function returnHome(changepage){
    Gozintas.reset();
    Gozintas.showSplitTipButtons();
    $(':input').val('');
    if(changepage){
        $.mobile.changePage("#page1")
    }
}