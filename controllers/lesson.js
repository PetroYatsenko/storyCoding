const Monster = require('../models/Monster');
const Story = require('../models/Story');
const Steps = require('../models/Step');
const Promise = require('bluebird');

var lang = 'uk';//TODO lang support

exports.pomponMonster = (req, res, next) => {
  var query = { story: 'pompon_monster', type: 'lesson'}; //TODO replace monster with param
  var state = 'state_' + lang; 
  var items = 'items_' + lang;
  obj = {
   story: 'pompon_monster',
   type: 'lesson',
   steps: [
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
  ]
  };
  
  
  Promise.all([
    Steps.findOne(query),
    Story.findOne(query)
  ]).spread(function(steps, story) {
    
    res.render('13_stories/pompon_monster', { 
      title: story[state].title, 
      story_name: story[state].name,
      subject: story[state].subject, // What do we studying? (loops)
      boy_talent: story[state].boy_talent,
      boy_action: story[state].boy_action,
      mom_talent: story[state].mom_talent,
      mom_action: story[state].mom_action,
      your_talent: story[state].your_talent,
      your_action: story[state].your_action,
      boy_hat: story[state].boy_hat,
      greetings: story[state].greetings,
      story_items: story[items],
      monster_talent: story[state].monster_talent,
      monster_action: story[state].monster_action,
      monster_danger: story[state].monster_danger,
      steps: JSON.stringify(steps.steps).replace(/<\//g, "<\\/"),
    });
  });
};

exports.howPomponMade = (req, res, next) => {
  res.render('13_stories/pompon_how_its_made', 
    {
      title: 'Як зроблена історія про балабонового монстра?',
      heroes_can: 'Пригадаємо, що вміють персонажі:',
      monster_talent: 'Балабоновий Монстр',
      monster_action: 'утворюється з чотирьох балабонів і поглинає весь світ',
      boy_talent: 'Левко',
      boy_action: 'уміє відгризти балабон',
      mom_talent: 'Мама',
      mom_action: 'уміє пришити балабон',
      your_talent: 'Ти можеш',
      your_action: 'Написати історію з циклом',
      about_this_story: 'Аби написати історію про монстра, Галина Ткачук\
        скористалася циклом -- повторенням подібних подій із несподіваним завершенням.',
      explanation_1: 
        'Мама та син пришивають та відривають балабони кілька разів.\
        Такі послідовності називають "циклами".',
      explanation_2:
        'Балабоновий монстр з\'являється, коли разом збираються чотири балабони. \
        Цикл завершується, коли Балабоновий монстр пожирає весь світ. \.',
      explanation_3:
        'Кожен цикл повинен мати умову його завершення. Інакше цикл триватиме нескінченно довго!',
      select_heroes_link: '/practice/heroes'
    }
  );
}


