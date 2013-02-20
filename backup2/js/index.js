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
    group_size = $("#page3 [class^='group-']").size();
    new_group = new Group()
    new_group.peopleInParty = 0;
    groups.push(new_group)
    $("<div data-role='collapsible' data-content-theme='c' data-theme='a' id ='group-"+(group_size+1)+"' class='group-"+(group_size+1)+" visible' data-routing='group.html'><h3>Group "+(group_size+1)+"</h3></div>").appendTo('.groups');
    $("<div data-role='collapsible' data-content-theme='c' data-theme='a' id ='group-"+(group_size+1)+"' class='group-"+(group_size+1)+" visible' data-routing='total.html'><h3>Group "+(group_size+1)+"</h3></div>").appendTo('.groups-final');
    loadPartials(".group-"+(group_size+1)+"[data-routing]");
}

function removeGroup()
{
    group_size = $("#page3 [class^='group-']").size();
    if(group_size !=1)
    {
        $(".group-"+group_size).remove();
        groups.pop(new Group())
    }
}
