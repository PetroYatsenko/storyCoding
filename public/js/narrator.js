window.addEventListener("DOMContentLoaded", function(event) {
  var current_step = 0;
  const textarea = 'your_story';
  const taskId = 'task_';
  const storyId = 'story_item_';
  // TODO: translation
  const browserAlert = 'Looks like your browser has no web-session support. Please, use a newest browser version.';  
  var story = [];
  var webStorageCheck = function() {
    if (typeof(Storage) === "undefined") {
      alert(browserAlert);
    }
  }();
  
  var strip = function(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
    
  var getStep = function() {
    return current_step;    
  };
  
  // TODO: get a step from the browser`s session
  // to avoid a step loss by the page reboot 
  // Add trecking uid to verify one lesson's session
  var getStepData = function() {
    return steps[getStep()];
  };
  
  // TODO: record step to the browser session
  var increaseStep = function() {
    current_step++;
  };  

  var onClickProcessing = function(todo, key) {
    if (todo.length !== 0) {
      var active = document.getElementById(key);
      var f = new Function('arrangeByClick', todo);

      active.onclick = function() {       
        f();
        this.onclick = null; // Disable onclick after the first run
      };
    }
  };
  
  var recordStory = function() {
    var storyItem = storyId + getStep();
    var taskItem = taskId + getStep();
    
    story.push(strip(document.getElementById(storyItem).innerHTML));    
    story.push(strip(document.getElementById(taskItem).innerHTML));
    story.push(strip(document.getElementById(textarea).value));
  }
  
  var saveStory = function() {
    sessionStorage.setItem('story', JSON.stringify(story));
    sessionStorage.setItem('title', storyTitle);
  }
  
  var arrangeNewStep = function() {         
    document.getElementById(storyId + getStep()).classList.add('visible');
    document.getElementById(nextButton).classList.remove('active');    
    
    var next = document.getElementById(nextButton);
    
    next.onclick = function() {
      if (typeof practice !== 'undefined' && practice) recordStory();
      increaseStep();
      // Detect the last step
      if (getStep() < steps.length) {
        rmPrevTxtItem();        
        setStepData();    
        addActions();        
        window.scrollTo(0, 0);
      } else {
        if (typeof practice !== 'undefined' && practice) saveStory();
        window.location.replace(nextPath);
      }      
    }
  };  

  var rmPrevTxtItem = function() {
    var prevStep = getStep() - 1;
    document.getElementById(storyId + prevStep).classList.remove('visible');
    // For story builder remove previous task & user`s text too
    if (typeof practice !== 'undefined' && practice) {
      document.getElementById(textarea).classList.remove('visible');
      document.getElementById(textarea).value = '';
      document.getElementById(taskId + prevStep).classList.remove('visible');      
    }
  };
  
  /**
   * Generates onclick actions for multiple page elements
   * 
   * @param {string} id -- action button ID
   * @param {object} replaceObj - includes replaced element ID (key) & replace data
   * @returns {undefined}
   */
  var processProp = function(prop, id, todo, actionsObj) {
    for (var key in actionsObj) {            
      for (var i in actionsObj[key]) {          
        switch(prop) {
          case 'replace':
            todo += 'document.getElementById("' + key + '").' + i + '="' + actionsObj[key][i] + '";';
            break; 
          case 'remove':
            todo += 'document.getElementById("' + key + '").classList.' + prop + '("' + actionsObj[key][i] + '");';
            break;
          case 'add':
            todo += 'document.getElementById("' + key + '").classList.' + prop + '("' + actionsObj[key][i] + '");';
            break;
          case 'toggle':            
            if (actionsObj[key][i] === 'disabled') { 
              todo += 'document.getElementById("' + key + '").classList.remove("active");';
              todo += 'document.getElementById("' + key + '").disabled = true;';
            } else {
              todo += 'document.getElementById("' + key + '").disabled = false;';
            }  
            break;
        }       
      }
    }
    
   return todo;    
  };
  
  
  /**
   * Maps step state to the page active elements
   */
  var setStepData = function() {    
    var stepData = getStepData();
    var stepInitials = stepData.state;
    
    for (var key in stepInitials) {
      if (stepInitials.hasOwnProperty(key)) {
        var btn = document.getElementById(key);
        if (stepInitials[key] === 'disabled') {
          btn.disabled = true;
        } else { // presume 'active'
          btn.disabled = false;
          btn.classList.add(stepInitials[key]);
        }
      }
    }    
  };
  
  var addActions = function() {
    var actions = getStepData().actions;
    var todo;

    // Walk by buttons IDs
    for (var key in actions) {
      todo = '';
      
      for (var i in actions[key]) {
        todo = processProp(i, key, todo, actions[key][i]);        
      }
      
      onClickProcessing(todo, key);
    }
    
    arrangeNewStep();
  };
  
  setStepData();
  addActions();

}, false);