window.addEventListener("DOMContentLoaded", function(event) {
  var current_step = 0;
  const nextButton = 'go';
  const itemId = 'story_item';
  const nextPath = '/lessons/pompon/how-its-made';
  
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

  var arrangeNewStep = function() {         
    document.getElementById(itemId + '_' + getStep()).classList.add('visible');
//    document.getElementById(nextButton).classList.remove('enabled');    
    
    var next = document.getElementById(nextButton);
    
    next.onclick = function() {
      increaseStep();
      // Detect the last step
      if (getStep() < steps.length) {        
        rmPrevTxtItem(itemId);
        setStepData();    
        addActions();        
        window.scrollTo(0, 0);
      } else {
        window.location.replace(nextPath);
      }      
    }
  };

  var rmPrevTxtItem = function(itemId) {
    var prevStep = getStep() - 1;
    document.getElementById(itemId + '_' + prevStep).classList.remove('visible');
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
        document.getElementById(key).classList.add(stepInitials[key]); 
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


