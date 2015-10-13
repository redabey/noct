
var currentCaseTemplate = new ReactiveVar({});

// Helpers.
Template.caseTemplate.helpers({
    'currentCaseTemplate': function() {
        return currentCaseTemplate.get();
    }    
});

Template.caseSteps.helpers({
    'isChecked': function(attrname, index) {
        var caset = currentCaseTemplate.get();
        return (caset.steps[index][attrname]) ? true : false;
    }
});

// On rendered.
Template.caseTemplate.rendered = function() {
    $('.panel-collapse').collapse('hide');
}

// Events.
Template.caseTemplate.events({
    'change .case-template-attr': function(event) {
        event.preventDefault();
        var value = event.target.value;
        var attr = event.target.getAttribute("name");
        var caset = currentCaseTemplate.get();
        caset[attr] = value;
        currentCaseTemplate.set(caset);
    },
    
    'change .clean': function(event) {
        event.preventDefault();
        event.target.value = "";
    },
    
    'click #add-step': function(event, tpl) {
        event.preventDefault();
        var caset = currentCaseTemplate.get();
        if (!caset.steps) {
            caset.steps = [];
        }
        caset.steps.push({
            alert: true,
            blocking: false,
            hidden: false
        });
        currentCaseTemplate.set(caset);
        Tracker.afterFlush(function () {
            var focusedid = "apanel-" + (caset.steps.length - 1);
            tpl.find('#'+focusedid).focus();
        });
    },
    
    'click .case-step-action': function(event, tpl) {
        event.preventDefault();
        var action = event.target.getAttribute("action");
        var stepnum = parseInt(event.target.getAttribute("stepnum"));
        var caset = currentCaseTemplate.get();
        switch(action) {
            case "del":
                caset.steps.splice(stepnum, 1);
                currentCaseTemplate.set(caset);
                break;
            case "up":
                if (caset.steps.length > 1) {
                    var newpos = (stepnum === 0) ? caset.steps.length - 1 : stepnum - 1;
                    caset.steps.move(stepnum, newpos);
                    currentCaseTemplate.set(caset);
                    Tracker.afterFlush(function () {
                        var focusedid = "apanel-" + newpos;
                        tpl.find('#'+focusedid).focus()
                    });
                }                
                break;
            case "down":
                if (caset.steps.length > 1) {
                    var newpos = (stepnum === caset.steps.length - 1) ? 0 : stepnum + 1;
                    caset.steps.move(stepnum, newpos);
                    currentCaseTemplate.set(caset);
                    Tracker.afterFlush(function () {
                        var focusedid = "apanel-" + newpos;
                        tpl.find('#'+focusedid).focus();
                    });
                }                
        }
    },
    
    'change .case-step-attr': function(event) {
        event.preventDefault();
        var value = event.target.value;
        var stepnum = parseInt(event.target.getAttribute("stepnum"));
        var attr = event.target.getAttribute("name");
        var caset = currentCaseTemplate.get();
        caset["steps"][stepnum][attr] = value;
        currentCaseTemplate.set(caset);
    },
    
    'click .add-event': function(event) {
        event.preventDefault();
        var stepnum = parseInt(event.target.getAttribute("stepnum"));
        var caset = currentCaseTemplate.get();
        if (!caset.steps[stepnum].events) {
            caset.steps[stepnum].events = [];
        }
        caset.steps[stepnum].events.push({});
        currentCaseTemplate.set(caset);
    },
    
    'click .case-event-action': function(event) {
        event.preventDefault();
        var action = event.target.getAttribute("action");
        var stepnum = parseInt(event.target.getAttribute("stepnum"));
        var eventnum = parseInt(event.target.getAttribute("eventnum"));
        var caset = currentCaseTemplate.get();
        switch(action) {
            case "del":
                caset.steps[stepnum].events.splice(eventnum, 1);
                currentCaseTemplate.set(caset);
                break;
            case "up":
                if (caset.steps[stepnum].events.length > 1) {
                    var newpos = (eventnum === 0) ? caset.steps[stepnum].events.length - 1 : eventnum - 1;
                    caset.steps[stepnum].events.move(eventnum, newpos);
                    currentCaseTemplate.set(caset);
                }                
                break;
            case "down":
                if (caset.steps[stepnum].events.length > 1) {
                    var newpos = (eventnum === caset.steps[stepnum].events.length - 1) ? 0 :eventnum + 1;
                    caset.steps[stepnum].events.move(eventnum, newpos);
                    currentCaseTemplate.set(caset);
                }                
        }
    },
    
    'change .case-event-attr': function(event) {
        event.preventDefault();
        var value = event.target.value;
        var stepnum = parseInt(event.target.getAttribute("stepnum"));
        var eventnum = parseInt(event.target.getAttribute("eventnum"));
        var attr = event.target.getAttribute("name");
        var caset = currentCaseTemplate.get();
        caset["steps"][stepnum]["events"][eventnum][attr] = value;
        currentCaseTemplate.set(caset);
    },
    
    'click #clear-template': function(event)
    {
        event.preventDefault();
        currentCaseTemplate.set({});
    },
    
    'click #save-template': function(event) {
        event.preventDefault();
        console.log(JSON.stringify(currentCaseTemplate.get()));
    }
});