window.addEventListener("DOMContentLoaded", function(event) {
  var current_step = 0;
  const nextButton = 'go_ahead'; //TODO make a CONST
  const itemId = 'story_item';//TODO replace as a constant?
  const nextPath = '/lessons/pompon/how-its-made';
  var steps = [];
  
  steps = [
    {
      state: {
        boy_button: 'enabled',
        mom_button: 'disabled',
        pompon_color: 'blue',
        monster_button: 'disabled',
        monster_danger: 'green',
        go_ahead: 'disabled',
        story_item_0: 'visible',
      },
      actions: {
        boy_button: {
          replace: {
            pompon_color: {
              src: '/images/pompons/hat/pompon_none.png' 
            },
            pompon_img: {
              src: '/images/pompons/monster/blue_25_op.png'
            },
          },
          remove: {
            go_ahead: {
              class: 'disabled'
            },
            boy_button: {
              class: 'enabled'
            }
          },
          add: {
            go_ahead: {
              class: 'enabled'
            },
            boy_button: {
              class: 'disabled'
            }
          },     
        },       
      }
    },
    {
      state: {
        boy_button: 'disabled',
        mom_button: 'enabled',
        monster_button: 'disabled',
        monster_danger: 'green',
        go_ahead: 'disabled',
      },
      actions: {
        mom_button: {
          replace: {
            pompon_color: {
              src: '/images/pompons/hat/pompon_red.png' 
            },
          },
          remove: {
            go_ahead: {
              class: 'disabled'
            },
            mom_button: {
              class: 'enabled'
            },
          },
          add: {
            go_ahead: {
              class: 'enabled'
            },
            mom_button: {
              class: 'disabled'
            },
          },
        },
      },
    },  
    { 
      state: {
        boy_button: 'enabled',
        mom_button: 'disabled',
        monster_button: 'disabled',
        monster_danger: 'green',
        go_ahead: 'disabled',
      },  
      actions: {
        boy_button: {
          replace: {
            pompon_color: {
              src: '/images/pompons/hat/pompon_none.png' 
            },
            pompon_img: {
              src: '/images/pompons/monster/red_50_op.png'
            },
          },
          remove: {
            go_ahead: {
              class: 'disabled'
            },
            boy_button: {
              class: 'enabled'
            }
          },
          add: {
            go_ahead: {
              class: 'enabled'
            },
            boy_button: {
              class: 'disabled'
            }
          },
        }  
      },
    },
    { 
      state: {
        boy_button: 'disabled',
        mom_button: 'enabled',
        monster_button: 'disabled',
        monster_danger: 'green',
        go_ahead: 'disabled',
      },
      actions: {
        mom_button: {
          replace: {
            pompon_color: {
              src: '/images/pompons/hat/pompon_green.png' 
            },
          },          
          remove: {
            go_ahead: {
              class: 'disabled'
            },            
            mom_button: {
              class: 'enabled'
            },
          },
          add: {
            go_ahead: {
              class: 'enabled'
            },
            mom_button: {
              class: 'disabled'
            },
          },
        }  
      },
    },
    { 
      state: {
        boy_button: 'enabled',
        mom_button: 'disabled',
        monster_button: 'disabled',
        monster_danger: 'green',
        go_ahead: 'disabled',
      },  
      actions: {
        boy_button: {
          replace: {
            pompon_color: {
              src: '/images/pompons/hat/pompon_none.png' 
            },
            pompon_img: {
              src: '/images/pompons/monster/green_75_op.png'
            }
          },
          remove: {
            go_ahead: {
              class: 'disabled'
            },
            boy_button: {
              class: 'enabled'
            },
            monster_danger: {
              class: 'green'
            }
          },
          add: {
            go_ahead: {
              class: 'enabled'
            },
            boy_button: {
              class: 'disabled'
            },
            monster_danger: {
              class: 'yellow'
            }
          },
        }  
      },
    },
    { 
      state: {
        boy_button: 'disabled',
        mom_button: 'enabled',
        monster_button: 'disabled',
        monster_danger: 'yellow',
        go_ahead: 'disabled',
      },  
      actions: {
        mom_button: {
          replace: {
            pompon_color: {
              src: '/images/pompons/hat/pompon_yellow.png' 
            },
          },
          remove: {
            go_ahead: {
              class: 'disabled'
            },
            mom_button: {
              class: 'enabled'
            },
          },
          add: {
            go_ahead: {
              class: 'enabled'
            },
            mom_button: {
              class: 'disabled'
            },
          },
        }  
      },
    },
    { 
      state: {
        boy_button: 'enabled',
        mom_button: 'disabled',
        monster_button: 'disabled',
        monster_danger: 'yellow',
        go_ahead: 'disabled',
      },  
      actions: {
        boy_button: {
          replace: {
            pompon_color: {
              src: '/images/pompons/hat/pompon_none.png' 
            },
            pompon_img: {
              src: '/images/pompons/monster/yellow_100_op.png'
            }
          },
          remove: {
            go_ahead: {
              class: 'disabled'
            },
            boy_button: {
              class: 'enabled'
            },
            monster_danger: {
              class: 'yellow'
            }
          },
          add: {
            go_ahead: {
              class: 'enabled'
            },
            boy_button: {
              class: 'disabled'
            },
            monster_danger: {
              class: 'red'
            }
          },
        }  
      },
    },
    { 
      state: {
        boy_button: 'disabled',
        mom_button: 'disabled',
        monster_button: 'enabled',
        monster_danger: 'red',
        go_ahead: 'disabled',
      },  
      actions: {
        monster_button: {
          replace: {
            pompon_img: {
              src: '/images/pompons/monster/monster_full.png',
            },
          },
          remove: {
            go_ahead: {
              class: 'disabled'
            },
            hole: {
              class: 'black_back'
            },
            monster_danger: {
              class: 'red',
            },
            monster_button: {
              class: 'enabled',
            },
          },
          add: {
            go_ahead: {
              class: 'enabled'
            },
            monster_danger: {
              class: 'disabled',
            },
            monster_button: {
              class: 'disabled',
            },
          },
        }  
      },
    },
  ];  
   
  var getStep = function() {
    return current_step;    
  };
  
  // TODO: get a step from the browser`s session
  // to avoid a step loss by the page reboot  
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
    document.getElementById(nextButton).classList.remove('enabled');    
    
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